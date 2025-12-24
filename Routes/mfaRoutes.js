const Router = require("express");
const mfaController = require("../Controller/mfaController");

const router = Router();

router.post("/setup", mfaController.setupTOTP);
router.post("/verify", mfaController.verify);

module.exports = router;
