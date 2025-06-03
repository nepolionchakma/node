const Router = require("express");
const defAccessEntitlementsController = require("../Controller/defAccessEntitlementsController");

const router = Router();

router.get("/", defAccessEntitlementsController.getDefAccessEntitlements);
router.get(
  "/:page/:limit",
  defAccessEntitlementsController.lazyLoadingDefAccessEntitlement
);
router.get(
  "/:id",
  defAccessEntitlementsController.getUniqueDefAccessEntitlement
);
router.post("/", defAccessEntitlementsController.createDefAccessEntitlement);
router.put("/:id", defAccessEntitlementsController.updateDefAccessEntitlement);
router.delete(
  "/:id",
  defAccessEntitlementsController.deleteDefAccessEntitlement
);

module.exports = router;
