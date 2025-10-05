const Router = require("express");
const invitationController = require("../Controller/newUserInvitationController");

const router = Router();

router.get("/verify", invitationController.verifyInvitation);
router.post("/via-email", invitationController.invitationViaEmail);
router.post("/via-link", invitationController.invitationViaLink);
router.post("/accept", invitationController.acceptInvitaion);

module.exports = router;
