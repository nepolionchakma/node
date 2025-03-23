const Router = require("express");
const orchestrationStudioController = require("../Controller/orchestrationStudioController");

const router = Router();

router.get("/", orchestrationStudioController.getDefProcesses);
router.get("/:process_name", orchestrationStudioController.getDefProcess);
router.post("/", orchestrationStudioController.createDefProcess);
router.put("/:process_id", orchestrationStudioController.updateDefProcess);
router.put(
  "/process-name/:process_id",
  orchestrationStudioController.updateDefProcessName
);
router.delete("/:process_id", orchestrationStudioController.deleteDefProcess);

module.exports = router;
