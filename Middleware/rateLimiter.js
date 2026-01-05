const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const {
  LOGIN_RATE_LIMIT_WINDOW,
  LOGIN_RATE_LIMIT_ATTEMPTS,
} = require("../Variables/variables");

exports.loginLimiter = rateLimit({
  windowMs: Number(LOGIN_RATE_LIMIT_WINDOW) * 60 * 1000 || 60 * 60 * 1000,
  max: Number(LOGIN_RATE_LIMIT_ATTEMPTS) || 5,
  message: {
    message: `Too many attempts. Please try again after ${
      Number(LOGIN_RATE_LIMIT_WINDOW) / 60000
    } minutes.`,
  },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  keyGenerator: (req, res) =>
    `${ipKeyGenerator(req, res)}-${req.headers["user-agent"]}`,
});
