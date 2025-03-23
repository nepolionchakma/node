const Router = require("express");
const manageAccessModelLogicsController = require("../Controller/manageAccessModelLogicsController");

const router = Router();

router.get("/", manageAccessModelLogicsController.getManageAccessModelLogics);
router.get(
  "/:id",
  manageAccessModelLogicsController.getUniqueManageAccessModelLogic
);
router.post(
  "/",
  manageAccessModelLogicsController.createManageAccessModelLogic
);
router.post(
  "/upsert",
  manageAccessModelLogicsController.upsertManageAccessModelLogic
);
router.delete(
  "/:id",
  manageAccessModelLogicsController.deleteManageAccessModelLogic
);
router.put(
  "/:id",
  manageAccessModelLogicsController.updateManageAccessModelLogic
);

module.exports = router;
