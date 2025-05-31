const Router = require("express");
const defAccessPointsElementsController = require("../Controller/defAccessPointElementsController");

const router = Router();

router.get("/", defAccessPointsElementsController.getDefAccessPointsElements);
router.get(
  "/:page/:limit",
  defAccessPointsElementsController.lazyLoadingDefAccessPointElements
);

router.get(
  "/:id",
  defAccessPointsElementsController.getUniqueDefAccessPointElement
);

router.get(
  "/:ids/:page/:limit",
  defAccessPointsElementsController.filterAccessPointsById
);

router.get(
  "/:ids",
  defAccessPointsElementsController.filterAccessPointsForDelete
);
router.post("/", defAccessPointsElementsController.createDefAccessPointElement);
router.put(
  "/:id",
  defAccessPointsElementsController.updateDefAccessPointElement
);
router.delete(
  "/:id",
  defAccessPointsElementsController.deleteDefAccessPointElement
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
