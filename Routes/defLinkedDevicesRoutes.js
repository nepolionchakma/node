const Router = require("express");
const linkedDevicesController = require("../Controller/defLinkedDevicesController");

const router = Router();

router.get("/:user_id", linkedDevicesController.getDevices);
router.get("/unique-device/:deviceId", linkedDevicesController.getUniqueDevice);
router.post("/add-device", linkedDevicesController.addDevice);
router.put(
  "/inactive-device/:user_id/:id",
  linkedDevicesController.inactiveDevice
);
router.put("/:user_id", linkedDevicesController.logoutFromAllDevices);
router.put(
  "/update-device-location/:deviceId",
  linkedDevicesController.updateDeviceLocation
);

module.exports = router;
