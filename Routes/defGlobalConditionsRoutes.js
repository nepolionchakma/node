const Router = require("express");
const defGlobalConditionsController = require("../Controller/defGlobalConditionsController");

const router = Router();

router.get("/", defGlobalConditionsController.getDefGlobalConditions);
router.get("/:id", defGlobalConditionsController.getUniqueDefGlobalCondition);
router.post("/", defGlobalConditionsController.createDefGlobalCondition);

router.put("/:id", defGlobalConditionsController.updateDefGlobalCondition);
router.delete("/:id", defGlobalConditionsController.deleteDefGlobalCondition);

module.exports = router;
