const Router = require("express");
const authentication = require("../Authentication/Authentication");
const { loginLimiter } = require("../Middleware/rateLimiter");

const router = Router();

router.post("/", loginLimiter, authentication.login);
router.get("/", authentication.logout);
router.get("/user", authentication.user);
router.get("/refresh-token", authentication.refreshToken);
// router.post("/", authentication.verifyToken);
router.post("/verify-token", authentication.verifyToken);
router.post("/verify-mfa-login", authentication.verifyMFALogin);

module.exports = router;
