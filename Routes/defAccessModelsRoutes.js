const Router = require("express");
const defAccessModelsControllers = require("../Controller/defAccessModelsControllers");

const router = Router();

router.get("/", defAccessModelsControllers.getDefAccessModels);
router.get(
  "/:page/:limit",
  defAccessModelsControllers.lazyLoadingDefAccessModels
);
router.get(
  "/search/:page/:limit",
  defAccessModelsControllers.searchLazyLoadingDefAccessModels
);
router.get("/:id", defAccessModelsControllers.uniqueDefAccessModel);
router.post("/", defAccessModelsControllers.createDefAccessModel);
router.put("/:id", defAccessModelsControllers.updateDefAccessModel);
router.delete("/:id", defAccessModelsControllers.deleteDefAccessModel);
// router.post("/upsert", manageAccessModelsControllers.upsertManageAccessModel);

module.exports = router;
