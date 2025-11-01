const Router = require("express");
const notificationsController = require("../Controller/defNotificationsController");

const router = Router();

router.post("/", notificationsController.createNotification);
router.get("/reply", notificationsController.getReplyNotifications);
router.get("/received", notificationsController.getRecievedNotifications);
router.get("/sent", notificationsController.getSentNotifications);
router.get("/drafts", notificationsController.getDraftNotifications);
router.get("/recyclebin", notificationsController.getRecycleBinNotifications);
router.get("/unread", notificationsController.getUnreadNotifications);
router.put("/update-readers", notificationsController.updateReaders);
router.put("/move-to-recyclebin", notificationsController.moveToRecycleBin);
router.put("/restore", notificationsController.restoreNotification);
router.put(
  "/remove-from-recyclebin",
  notificationsController.removeFromRecycleBin
);
router.put(
  "/move-multiple-to-recyclebin/:userId",
  notificationsController.moveMultipleToRecycleBin
);
router.put(
  "/move-multiple-from-recyclebin/:userId",
  notificationsController.removeMultipleFromRecycleBin
);
router.get("/unique", notificationsController.getUniqueNotification);
router.put("/:notificationId", notificationsController.updateNotification);

// router.get("/", notificationsController.getAllNotification);

router.delete("/:notificationId", notificationsController.deleteNotification);

module.exports = router;
