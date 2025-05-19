const Router = require("express");
const defGlobalConditionLogicAttributesController = require("../Controller/defGlobalConditionLogicAttributesController");

const router = Router();

router.get(
  "/",
  defGlobalConditionLogicAttributesController.getManageGlobalConditionLogicArrtibutes
);
// router.get(
//   "/:page/:limit",
//   defGlobalConditionLogicAttributesController.lazyLoadingDefGlobalConditionLogicAttributes
// );
router.get(
  "/:id",
  defGlobalConditionLogicAttributesController.getUniqueManageGlobalConditionLogicArrtibute
);
router.post(
  "/",
  defGlobalConditionLogicAttributesController.createManageGlobalConditionLogicArrtibute
);
router.post(
  "/upsert",
  defGlobalConditionLogicAttributesController.upsertManageGlobalConditionLogicArrtibute
);
router.put(
  "/:id",
  defGlobalConditionLogicAttributesController.updateManageGlobalConditionLogicArrtibute
);
router.delete(
  "/:id",
  defGlobalConditionLogicAttributesController.deleteManageGlobalConditionLogicArrtibute
);

module.exports = router;
