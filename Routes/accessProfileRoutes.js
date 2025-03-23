const Router = require("express");
const accessProfileController = require("../Controller/accessProfileController");

const router = Router();

router.get("/:user_id", accessProfileController.getAccessProfiles);
router.post("/:user_id", accessProfileController.createProfile);
router.put("/:user_id/:serial_number", accessProfileController.updateProfile);
router.delete(
  "/:user_id/:serial_number",
  accessProfileController.deleteProfile
);

module.exports = router;
