const Router = require("express");
const manageAccessEntitlementsController = require("../Controller/manageAccessEntitlementsController");

const router = Router();

router.get("/", manageAccessEntitlementsController.getManageAccessEntitlements);
router.get(
  "/:page/:limit",
  manageAccessEntitlementsController.getPerPageManageAccessEntitlement
);
router.get(
  "/:id",
  manageAccessEntitlementsController.getUniqueManageAccessEntitlement
);
router.post(
  "/",
  manageAccessEntitlementsController.createManageAccessEntitlement
);
router.put(
  "/:id",
  manageAccessEntitlementsController.updateManageAccessEntitlement
);
router.delete(
  "/:id",
  manageAccessEntitlementsController.deleteManageAccessEntitlement
);

module.exports = router;
