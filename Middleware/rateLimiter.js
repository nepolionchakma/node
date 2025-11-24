const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5, // 5 login attempts per window per IP
  message: {
    message: "Too many attempts. Please try again after 60 minutes.",
  },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Default is req.ip; you can customize:
    return req.ip;
  },
});
