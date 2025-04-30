const Router = require("express");
const dataSourcesController = require("../Controller/dataSourcesController");

const router = Router();

router.get("/", dataSourcesController.getDataSources);
router.get("/:page/:limit", dataSourcesController.getPerPageDataSources);
router.get("/:id", dataSourcesController.getUniqueDataSource);
router.post("/", dataSourcesController.createDataSource);
router.put("/:id", dataSourcesController.updateDataSource);
router.delete("/:id", dataSourcesController.deleteDataSource);

module.exports = router;
