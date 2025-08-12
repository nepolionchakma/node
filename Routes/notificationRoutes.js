const Router = require("express");
const notificationsController = require("../Controller/notificationsController");

const router = Router();

router.get("/", notificationsController.getAllNotification);

router.get("/:id", notificationsController.getUniqueNotification);

router.post("/", notificationsController.createNotification);

router.put("/:notificationId", notificationsController.updateNotification);

router.delete("/:notificationId", notificationsController.deleteNotification);

router.get(
  "/reply/:parentId/:userId",
  notificationsController.getReplyNotifications
);

router.get(
  "/received/:userId/:page/:limit",
  notificationsController.getRecievedNotifications
);

router.get(
  "/total-received/:userId",
  notificationsController.getTotalRecievedNotifications
);

router.get(
  "/sent/:userId/:page/:limit",
  notificationsController.getSentNotifications
);

router.get(
  "/total-sent/:userId",
  notificationsController.getTotalSentNotifications
);

router.get(
  "/draft/:userId/:page/:limit",
  notificationsController.getDraftNotifications
);

router.get(
  "/total-draft/:userId",
  notificationsController.getTotalDraftNotifications
);

router.get(
  "/recyclebin/:userId/:page/:limit",
  notificationsController.getRecycleBinNotifications
);

router.get(
  "/total-recyclebin/:userId",
  notificationsController.getTotalRecycleBinNotifications
);

router.get("/unread/:userId", notificationsController.getUnreadNotifications);

router.put(
  "/update-readers/:parentId/:userId",
  notificationsController.updateReaders
);

router.put(
  "/move-to-recyclebin/:notificationId/:userId",
  notificationsController.moveToRecycleBin
);

router.put(
  "/restore/:notificationId/:userId",
  notificationsController.restoreNotification
);

router.put(
  "/remove-from-recyclebin/:notificationId/:userId",
  notificationsController.removeFromRecycleBin
);

router.put(
  "/move-multiple-to-recyclebin/:userId",
  notificationsController.moveMultipleToRecycleBin
);

router.put(
  "/move-multiple-from-recyclebin/:userId",
  notificationsController.moveMultipleFromRecycleBin
);

module.exports = router;
