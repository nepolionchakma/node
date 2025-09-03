const Router = require("express");
const accessPointsEntitlementController = require("../Controller/defAccessPointsEntitlementsController");

const router = Router();

router.get("/", accessPointsEntitlementController.getAccessPointsEntitlement);
router.get(
  "/:ids/:page/:limit",
  accessPointsEntitlementController.filterAccessPointsById
);
router.get(
  "/:ids",
  accessPointsEntitlementController.filterAccessPointsForDelete
);
router.get(
  "/search/element-name/:page/:limit",
  accessPointsEntitlementController.searchLazyLoadingAccessPointsElement
);
router.post(
  "/",
  accessPointsEntitlementController.createAccessPointsEntitlement
);
router.delete(
  "/:id",
  accessPointsEntitlementController.deleteAccessPointsEntitlement
);

// router.put(
//   "/:id",
//   accessPointsEntitlementController.updateAccessPointsEntitlement
// );
// router.post(
//   "/upsert",
//   accessPointsEntitlementController.upsertAccessPointsEntitlement
// );
// router.get(
//   "/:page/:limit",
//   accessPointsEntitlementController.getPerPageAccessPoints
// );
// router.get(
//   "/:id",
//   accessPointsEntitlementController.getUniqueAccessPointsEntitlement
// );

module.exports = router;
