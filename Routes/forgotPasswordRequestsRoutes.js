const Router = require("express");
const forgotPasswordController = require("../Controller/forgotPasswordRequestsController");

const router = Router();

router.post("/", forgotPasswordController.createRequest);
router.get("/verify", forgotPasswordController.verifyRequest);

module.exports = router;
