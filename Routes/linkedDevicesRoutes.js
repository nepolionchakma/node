const Router = require("express");
const linkedDevicesController = require("../Controller/linkedDevicesController");

const router = Router();

router.get("/:user_id", linkedDevicesController.getDevices);
router.post("/add-device", linkedDevicesController.addDevice);
router.put(
  "/inactive-device/:user_id/:id",
  linkedDevicesController.inactiveDevice
);
router.put("/:user_id", linkedDevicesController.logoutFromDevices);

module.exports = router;
