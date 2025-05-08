const Router = require("express");
const defAccessModelLogicAttributesControllers = require("../Controller/defAccessModelLogicAttributesControllers");

const router = Router();

router.get(
  "/",
  defAccessModelLogicAttributesControllers.getDefAccessModelAttributes
);
router.get(
  "/:id",
  defAccessModelLogicAttributesControllers.getUniqueDefAccessModelAttribute
);
router.post(
  "/",
  defAccessModelLogicAttributesControllers.createDefAccessModelAttribute
);
router.post(
  "/upsert",
  defAccessModelLogicAttributesControllers.upsertDefAccessModelAttribute
);
router.put(
  "/:id",
  defAccessModelLogicAttributesControllers.updateDefAccessModelAttribute
);
router.delete(
  "/:id",
  defAccessModelLogicAttributesControllers.deleteDefAccessModelAttribute
);

module.exports = router;
