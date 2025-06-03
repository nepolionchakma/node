const Router = require("express");
const defGlobalConditionsController = require("../Controller/defGlobalConditionsController");

const router = Router();

router.get("/", defGlobalConditionsController.getDefGlobalConditions);
router.get(
  "/:page/:limit",
  defGlobalConditionsController.lazyLoadingDefGlobalConditions
);
router.get(
  "/search/:page/:limit",
  defGlobalConditionsController.searchLazyLoadingDefGlobalConditions
);
router.get("/:id", defGlobalConditionsController.getUniqueDefGlobalCondition);
router.post("/", defGlobalConditionsController.createDefGlobalCondition);

router.put("/:id", defGlobalConditionsController.updateDefGlobalCondition);
router.delete("/:id", defGlobalConditionsController.deleteDefGlobalCondition);

module.exports = router;
