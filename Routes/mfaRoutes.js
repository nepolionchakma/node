const Router = require("express");
const mfaController = require("../Controller/mfaController");

const router = Router();

router.get("/list", mfaController.getMFAList);
router.get("/check-is-enabled", mfaController.checkIsMFAEnabled);
router.post("/setup", mfaController.setupTOTP);
// router.post("/upsert", mfaController.upsertMFA);
router.post("/verify", mfaController.verify);
router.delete("/delete", mfaController.deleteMFA);

module.exports = router;
