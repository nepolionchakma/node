const Router = require("express");
const accessEntitlementElementsController = require("../Controller/defAccessEntitlementElementsController");

const router = Router();

router.get(
  "/",
  accessEntitlementElementsController.getAccessEntitlementElement
);
router.get(
  "/:page/:limit",
  accessEntitlementElementsController.getPerPageAccessEntitlementElement
);
router.get(
  "/search/:page/:limit",
  accessEntitlementElementsController.searchLazyLoadingAccessEntitilementElement
);
router.get(
  "/:id",
  accessEntitlementElementsController.getUniqueAccessEntitlementElement
);
router.post(
  "/",
  accessEntitlementElementsController.createAccessEntitlementElement
);
router.delete(
  "/:entitlementId/:accessPointId",
  accessEntitlementElementsController.deleteAccessEntitlementElement
);

module.exports = router;
