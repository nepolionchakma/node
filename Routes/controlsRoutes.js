const Router = require("express");
const controlsControllers = require("../Controller/controlsController");

const router = Router();

router.get("/", controlsControllers.getControles);
router.get("/:id", controlsControllers.getUniqueControle);
router.post("/", controlsControllers.createControle);
router.delete("/:id", controlsControllers.deleteControle);
router.put("/:id", controlsControllers.updateControle);
// router.post("/upsert", manageAccessModelsControllers.upsertManageAccessModel);

module.exports = router;
