const router = require("express").Router();

const alertsController = require("../Controller/defAlertsController");

router.get("/view", alertsController.getAlerts);
router.post("/", alertsController.createAlert);
router.put("/:alert_id", alertsController.updateAlert);
router.put(
  "/acknowledge/:alert_id/:user_id",
  alertsController.updateAcknowledge
);
router.delete("/delete-multiple-alerts", alertsController.deleteMultipleAlerts);
router.delete("/:alert_id", alertsController.removeAlert);

// router.get("/", alertsController.alerts);

// router.get("/view/:alert_id", alertsController.getUniqueAlertFromView);
// router.get(
//   "/view/:user_id/:page/:limit",
//   alertsController.getAlertsFromViewPagination
// );
// router.get("/view/total/:user_id", alertsController.getTotalAlerts);
// router.get("/:alert_id", alertsController.getUniqueAlert);

module.exports = router;
