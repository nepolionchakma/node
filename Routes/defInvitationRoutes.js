const Router = require("express");
const invitaionController = require("../Controller/defInvitationController");

const router = Router();

router.get("/verify", invitaionController.verifyInvitation);
router.post("/via-email", invitaionController.invitaionViaEmail);
router.post("/via-link", invitaionController.invitaionViaLink);
router.post("/accept", invitaionController.acceptInvitaion);

module.exports = router;
