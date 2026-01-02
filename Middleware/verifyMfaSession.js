const jwt = require("jsonwebtoken");
const { JWT_SECRET_ACCESS_TOKEN } = require("../Variables/variables");

const verifyMfaSession = (req, res, next) => {
  try {
    const token =
      req?.body?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "MFA token required" });
    }

    jwt.verify(token, JWT_SECRET_ACCESS_TOKEN, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Invalid MFA token" });
      }

      // 🔐 Allow ONLY password-verified users
      if (payload.auth_stage !== "PASSWORD") {
        return res.status(403).json({
          message: "Invalid MFA session",
        });
      }

      req.mfaSession = payload;
      next();
    });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = verifyMfaSession;
