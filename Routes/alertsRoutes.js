const router = require("express").Router();

const alertsController = require("../Controller/alertsController");

router.post("/", alertsController.createAlert);
router.get("/", alertsController.alerts);
router.get("/:alert_id", alertsController.getUniqueAlert);
router.put("/:alert_id", alertsController.updateAlert);

module.exports = router;
