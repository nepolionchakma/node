const Router = require("express");
const manageGlobalConditionLogicAttributesController = require("../Controller/manageGlobalConditionLogicAttributesController");

const router = Router();

router.get(
  "/",
  manageGlobalConditionLogicAttributesController.getManageGlobalConditionLogicArrtibutes
);
router.get(
  "/:id",
  manageGlobalConditionLogicAttributesController.getUniqueManageGlobalConditionLogicArrtibute
);
router.post(
  "/",
  manageGlobalConditionLogicAttributesController.createManageGlobalConditionLogicArrtibute
);
router.post(
  "/upsert",
  manageGlobalConditionLogicAttributesController.upsertManageGlobalConditionLogicArrtibute
);
router.put(
  "/:id",
  manageGlobalConditionLogicAttributesController.updateManageGlobalConditionLogicArrtibute
);
router.delete(
  "/:id",
  manageGlobalConditionLogicAttributesController.deleteManageGlobalConditionLogicArrtibute
);

module.exports = router;
