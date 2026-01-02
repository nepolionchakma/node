const Router = require("express");
const defPropertyController = require("../Controller/defDatasourceConnectorPropertiesController");

const router = Router();

router.get("/", defPropertyController.getUniqueProperty);
router.post("/", defPropertyController.createProperties);
router.put("/", defPropertyController.updateProperties);

module.exports = router;
