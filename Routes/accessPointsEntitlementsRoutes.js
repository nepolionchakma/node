const Router = require("express");
const accessPointsEntitlementController = require("../Controller/accessPointsEntitlementsController");

const router = Router();

router.get("/", accessPointsEntitlementController.getAccessPointsEntitlement);
router.get(
  "/:page/:limit",
  accessPointsEntitlementController.getPerPageAccessPoints
);
router.get(
  "/:ids/:page/:limit",
  accessPointsEntitlementController.filterAccessPointsById
);
router.get(
  "/:ids",
  accessPointsEntitlementController.filterAccessPointsForDelete
);
router.get(
  "/:id",
  accessPointsEntitlementController.getUniqueAccessPointsEntitlement
);
router.post(
  "/",
  accessPointsEntitlementController.createAccessPointsEntitlement
);
router.delete(
  "/:id",
  accessPointsEntitlementController.deleteAccessPointsEntitlement
);
router.put(
  "/:id",
  accessPointsEntitlementController.updateAccessPointsEntitlement
);
router.post(
  "/upsert",
  accessPointsEntitlementController.upsertAccessPointsEntitlement
);

module.exports = router;
