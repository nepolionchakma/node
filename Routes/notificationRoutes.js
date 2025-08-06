const Router = require("express");
const notificationsController = require("../Controller/notificationsController");

const router = Router();

router.get("/", notificationsController.getAllNotification);
router.get(
  "/reply/:parentId/:userId",
  notificationsController.getReplyNotifications
);

module.exports = router;
