const Router = require("express");
const manageGlobalConditionsController = require("../Controller/manageGlobalConditionsController");

const router = Router();

router.get("/", manageGlobalConditionsController.getManageGlobalConditions);
router.get(
  "/:id",
  manageGlobalConditionsController.getUniqueManageGlobalCondition
);
router.post("/", manageGlobalConditionsController.createManageGlobalCondition);
router.delete(
  "/:id",
  manageGlobalConditionsController.deleteManageGlobalCondition
);
router.put(
  "/:id",
  manageGlobalConditionsController.updateManageGlobalCondition
);

module.exports = router;
