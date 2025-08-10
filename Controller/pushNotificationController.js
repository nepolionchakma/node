const decodedKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY_BASE64,
  "base64"
).toString("utf-8");

const admin = require("firebase-admin");

const serviceAccount = JSON.parse(decodedKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//To store the tokens
const userTokens = {};

// Register device tokens with usernames
exports.registerToken = (req, res) => {
  const { token, userId } = req.body;
  const user = Number(userId);

  if (!user || !token) {
    return res.status(400).send("User and token are required");
  }

  // Add the token to the user's list of tokens
  if (!userTokens[user]) {
    userTokens[user] = new Set();
  }
  userTokens[user].add(token);

  res.send("Token registered successfully");
};

// Unregister device tokens
exports.unregisterToken = (req, res) => {
  const { token, userId } = req.body;
  const user = Number(userId);

  if (!user || !token) {
    return res.status(400).send("User and token are required");
  }

  // Check if the user and token exist
  if (userTokens[user] && userTokens[user].has(token)) {
    userTokens[user].delete(token);

    // If no more tokens are registered for the user, clean up the entry
    if (userTokens[user].size === 0) {
      delete userTokens[user];
    }

    res.send("Token unregistered successfully");
  } else {
    res.status(404).send("Token or user not found");
  }
};

//To send notification to every individual fcm token
exports.sendNotification = async (req, res) => {
  const { notificationID, parentId, date, sender, recipients, subject, body } =
    req.body;

  if (
    !sender ||
    !recipients ||
    !subject ||
    !body ||
    !notificationID ||
    !date ||
    !parentId
  ) {
    return res
      .status(400)
      .send("sender, recipients, subject, and body are required");
  }

  let allTokens = new Set();
  recipients.forEach((user) => {
    if (userTokens[Number(user)]) {
      userTokens[Number(user)].forEach((token) => allTokens.add(token));
    }
  });

  if (allTokens.size === 0) {
    return res.status(404).send("No tokens found for the specified users");
  }

  const tokensArray = Array.from(allTokens);

  tokensArray.forEach(async (token) => {
    try {
      await admin.messaging().send({
        notification: {
          title: `${sender}: ${subject}`,
          body: body,
        },
        token: token,
        data: {
          payload: JSON.stringify(req.body), // Sending the entire request body as a string
        },
      });
      return res
        .status(201)
        .json({ message: "notification sent to the users" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};
