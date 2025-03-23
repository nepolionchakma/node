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
router.delete(
  "/:id",
  manageAccessModelLogicAttributesControllers.deleteManageAccessModelAttribute
);
router.put(
  "/:id",
  manageAccessModelLogicAttributesControllers.updateManageAccessModelAttribute
);
router.post(
  "/upsert",
  manageAccessModelLogicAttributesControllers.upsertManageAccessModelAttribute
);

module.exports = router;
