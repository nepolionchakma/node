const Router = require("express");
const defGlobalConditionLogicAttributesController = require("../Controller/defGlobalConditionLogicAttributesController");

const router = Router();

router.get(
  "/",
  defGlobalConditionLogicAttributesController.getDefGlobalConditionLogicAttributes
);
router.get(
  "/:page/:limit",
  defGlobalConditionLogicAttributesController.lazyLoadingDefGlobalConditionLogicAttributes
);
router.get(
  "/:id",
  defGlobalConditionLogicAttributesController.getUniqueDefGlobalConditionLogicAttribute
);
router.post(
  "/",
  defGlobalConditionLogicAttributesController.createDefGlobalConditionLogicAttribute
);
router.post(
  "/upsert",
  defGlobalConditionLogicAttributesController.upsertManageGlobalConditionLogicArrtibute
);
router.put(
  "/:id",
  defGlobalConditionLogicAttributesController.updateDefGlobalConditionLogicAtrribute
);
router.delete(
  "/:id",
  defGlobalConditionLogicAttributesController.deleteManageGlobalConditionLogicArrtibute
);

module.exports = router;
