const Router = require("express");
const forgotPasswordController = require("../Controller/forgotPasswordRequestsController");

const router = Router();

router.post("/", forgotPasswordController.createRequest);

module.exports = router;
