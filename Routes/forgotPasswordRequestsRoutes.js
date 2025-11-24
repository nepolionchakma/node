const Router = require("express");
const forgotPasswordController = require("../Controller/forgotPasswordRequestsController");
const { loginLimiter } = require("../Middleware/rateLimiter");

const router = Router();

router.post("/", loginLimiter, forgotPasswordController.createRequest);
router.get("/verify", forgotPasswordController.verifyRequest);

module.exports = router;
