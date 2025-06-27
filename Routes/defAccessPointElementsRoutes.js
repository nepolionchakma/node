const Router = require("express");
const defAccessPointsElementsController = require("../Controller/defAccessPointElementsController");

const router = Router();
router.get(
  "/access-points/id-delete",
  defAccessPointsElementsController.filterAccessPointsByIdDelete
);

router.get(
  "/accesspoints",
  defAccessPointsElementsController.filterAccessPointsById
);

router.get("/", defAccessPointsElementsController.getDefAccessPointsElements);
router.get(
  "/:page/:limit",
  defAccessPointsElementsController.lazyLoadingDefAccessPointElements
);
router.get(
  "/def_access_point_elements/search/:page/:limit",
  defAccessPointsElementsController.getSearchAccessPointElementsLazyLoading
);
router.get(
  "/:id",
  defAccessPointsElementsController.getUniqueDefAccessPointElement
);
router.post("/", defAccessPointsElementsController.createDefAccessPointElement);
router.put(
  "/:id",
  defAccessPointsElementsController.updateDefAccessPointElement
);
router.delete(
  "/delete/:id",
  defAccessPointsElementsController.deleteDefAccessPointElement
);

// router.get(
//   "/accesspoints-not-pagination",
//   defAccessPointsElementsController.filterAccessPointsByIdWithoutPagination
// );

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
