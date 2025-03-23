const Router = require("express");
const manageGlobalConditionLogicsController = require("../Controller/manageGlobalConditionLogicsController");

const router = Router();

router.get(
  "/",
  manageGlobalConditionLogicsController.getManageGlobalConditionLogics
);
router.get(
  "/:id",
  manageGlobalConditionLogicsController.getUniqueManageGlobalConditionLogic
);
router.post(
  "/",
  manageGlobalConditionLogicsController.createManageGlobalConditionLogic
);
router.post(
  "/upsert",
  manageGlobalConditionLogicsController.upsertManageGlobalConditionLogic
);
router.delete(
  "/:id",
  manageGlobalConditionLogicsController.deleteManageGlobalConditionLogic
);
router.put(
  "/:id",
  manageGlobalConditionLogicsController.updateManageGlobalConditionLogic
);

module.exports = router;
