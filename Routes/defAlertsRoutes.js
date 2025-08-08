const router = require("express").Router();

const alertsController = require("../Controller/defAlertsController");

router.post("/", alertsController.createAlert);
router.get("/", alertsController.alerts);
router.get("/view", alertsController.getAlertsFromView);
router.get("/view/:alert_id", alertsController.getUniqueAlertFromView);
router.get(
  "/view/:user_id/:page/:limit",
  alertsController.getAlertsFromViewPagination
);
router.get("/view/total/:user_id", alertsController.getTotalAlerts);
router.get("/:alert_id", alertsController.getUniqueAlert);
router.put("/:user_id/:alert_id", alertsController.updateAlert);
router.delete("/:alert_id", alertsController.removeAlert);

module.exports = router;
