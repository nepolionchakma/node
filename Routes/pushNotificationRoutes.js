const Router = require("express");
const pushNotificationController = require("../Controller/pushNotificationController");

const router = Router();

router.post("/register-token", pushNotificationController.registerToken);
router.post("/unregister-token", pushNotificationController.unregisterToken);
router.post("/send-notification", pushNotificationController.sendNotification);

module.exports = router;
