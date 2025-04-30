const Router = require("express");
const manageAccessModelsControllers = require("../Controller/manageAccessModelsControllers");

const router = Router();

router.get("/", manageAccessModelsControllers.getManageAccessModels);
router.get("/:id", manageAccessModelsControllers.getUniqueManageAccessModel);
router.post("/", manageAccessModelsControllers.createManageAccessModel);
router.put("/:id", manageAccessModelsControllers.updateManageAccessModel);
router.delete("/:id", manageAccessModelsControllers.deleteManageAccessModel);
// router.post("/upsert", manageAccessModelsControllers.upsertManageAccessModel);

module.exports = router;
