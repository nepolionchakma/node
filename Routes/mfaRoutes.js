const Router = require("express");
const mfaController = require("../Controller/mfaController");

const router = Router();

router.get("/list", mfaController.getMFAList);
router.get("/check-is-enabled", mfaController.checkIsMFAEnabled);
router.post("/setup", mfaController.setupTOTP);
// router.post("/upsert", mfaController.upsertMFA);
router.post("/verify-otp", mfaController.verifyOTP);
router.post("/check-password", mfaController.checkPassword);
router.post("/switch-mfa", mfaController.switchMFA);
router.delete("/delete", mfaController.deleteMFA);

module.exports = router;
