const Router = require("express");
const defDataSourcesController = require("../Controller/defDataSourcesController");

const router = Router();

router.get("/", defDataSourcesController.getDefDataSources);
router.get("/:page/:limit", defDataSourcesController.lazyLoadingDefDataSources);
router.get(
  "/search/:page/:limit",
  defDataSourcesController.lazyLoadingDefSearchDataSources
);
router.get("/:id", defDataSourcesController.getUniqueDefDataSource);
router.post("/", defDataSourcesController.createDefDataSource);
router.put("/:id", defDataSourcesController.updateDefDataSource);
router.delete("/:id", defDataSourcesController.deleteDefDataSource);

module.exports = router;
