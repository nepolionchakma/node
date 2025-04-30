const Router = require("express");
const manageAccessModelLogicAttributesControllers = require("../Controller/manageAccessModelLogicAttributesControllers");

const router = Router();

router.get(
  "/",
  manageAccessModelLogicAttributesControllers.getManageAccessModelAttributes
);
router.get(
  "/:id",
  manageAccessModelLogicAttributesControllers.getUniqueManageAccessModelAttribute
);
router.post(
  "/",
  manageAccessModelLogicAttributesControllers.createManageAccessModelAttribute
);
router.post(
  "/upsert",
  manageAccessModelLogicAttributesControllers.upsertManageAccessModelAttribute
);
router.put(
  "/:id",
  manageAccessModelLogicAttributesControllers.updateManageAccessModelAttribute
);
router.delete(
  "/:id",
  manageAccessModelLogicAttributesControllers.deleteManageAccessModelAttribute
);

module.exports = router;
