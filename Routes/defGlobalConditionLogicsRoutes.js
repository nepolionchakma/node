const Router = require("express");
const defGlobalConditionLogicsController = require("../Controller/defGlobalConditionLogicsController");

const router = Router();

router.get("/", defGlobalConditionLogicsController.getDefGlobalConditionLogics);
router.get(
  "/:id",
  defGlobalConditionLogicsController.getUniqueDefGlobalConditionLogic
);
router.post(
  "/",
  defGlobalConditionLogicsController.createDefGlobalConditionLogic
);
router.get(
  "/:page/:limit",
  defGlobalConditionLogicsController.lazyLoadingDefGlobalConditionLogics
);
router.post(
  "/upsert",
  defGlobalConditionLogicsController.upsertDefGlobalConditionLogic
);

router.put(
  "/:id",
  defGlobalConditionLogicsController.updateDefGlobalConditionLogic
);
router.delete(
  "/:id",
  defGlobalConditionLogicsController.deleteDefGlobalConditionLogic
);
module.exports = router;
