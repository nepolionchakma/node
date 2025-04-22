const Router = require("express");
const controlsControllers = require("../Controller/controlsController");

const router = Router();

router.get("/", controlsControllers.getControls);
router.get("/:id", controlsControllers.getUniqueControl);
router.post("/", controlsControllers.createControl);
router.delete("/:id", controlsControllers.deleteControl);
router.put("/:id", controlsControllers.updateControl);

// router.post("/upsert", manageAccessModelsControllers.upsertManageAccessModel);

module.exports = router;
