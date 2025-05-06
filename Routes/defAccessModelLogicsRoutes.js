const Router = require("express");
const defAccessModelLogicsController = require("../Controller/defAccessModelLogicsController");

const router = Router();

router.get("/", defAccessModelLogicsController.getDefAccessModelLogics);
router.get("/:id", defAccessModelLogicsController.getUniqueDefAccessModelLogic);
router.post("/", defAccessModelLogicsController.createDefAccessModelLogic);
// router.post(
//   "/upsert",
//   defAccessModelLogicsController.upsertManageAccessModelLogic
// );

router.put("/:id", defAccessModelLogicsController.updateDefAccessModelLogic);
router.delete("/:id", defAccessModelLogicsController.deleteDefAccessModelLogic);

module.exports = router;
