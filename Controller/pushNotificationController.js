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
console.log(userTokens);

// Register device tokens with usernames
exports.registerToken = (req, res) => {
  const { token, username } = req.body;

  if (!username || !token) {
    return res.status(400).send("Username and token are required");
  }

  // Add the token to the user's list of tokens
  if (!userTokens[username]) {
    userTokens[username] = new Set();
  }
  userTokens[username].add(token);

  console.log(`Registered token: ${token} for user: ${username}`);
  res.send("Token registered successfully");
};

// Unregister device tokens
exports.unregisterToken = (req, res) => {
  const { token, username } = req.body;

  if (!username || !token) {
    return res.status(400).send("Username and token are required");
  }

  // Check if the user and token exist
  if (userTokens[username] && userTokens[username].has(token)) {
    userTokens[username].delete(token);
    console.log(`Unregistered token: ${token} for user: ${username}`);

    // If no more tokens are registered for the user, clean up the entry
    if (userTokens[username].size === 0) {
      delete userTokens[username];
    }

    res.send("Token unregistered successfully");
  } else {
    res.status(404).send("Token or username not found");
  }
};

//To send notification to every individual fcm token
exports.sendNotification = async (req, res) => {
  const { id, parentid, date, sender, recivers, subject, body } = req.body;

  if (!sender || !recivers || !subject || !body || !id || !date || !parentid) {
    return res
      .status(400)
      .send("sender, recivers, subject, and body are required");
  }

  let allTokens = new Set();
  recivers.forEach((user) => {
    if (userTokens[user.name]) {
      userTokens[user.name].forEach((token) => allTokens.add(token));
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
          title: `${sender.name}: ${subject}`,
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
