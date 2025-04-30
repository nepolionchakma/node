const Router = require("express");
const manageGlobalConditionsController = require("../Controller/manageGlobalConditionsController");

const router = Router();

router.get("/", manageGlobalConditionsController.getManageGlobalConditions);
router.get(
  "/:id",
  manageGlobalConditionsController.getUniqueManageGlobalCondition
);
router.post("/", manageGlobalConditionsController.createManageGlobalCondition);

router.put(
  "/:id",
  manageGlobalConditionsController.updateManageGlobalCondition
);router.delete(
  "/:id",
  manageGlobalConditionsController.deleteManageGlobalCondition
);

module.exports = router;
