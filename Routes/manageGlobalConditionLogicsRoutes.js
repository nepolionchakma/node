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

router.put(
  "/:id",
  manageGlobalConditionLogicsController.updateManageGlobalConditionLogic
);
router.delete(
  "/:id",
  manageGlobalConditionLogicsController.deleteManageGlobalConditionLogic
);
module.exports = router;
