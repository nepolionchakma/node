const Router = require("express");
const defTenantEnterpriseSetupController = require("../Controller/defEnterprisesController");

const router = Router();

router.get("/", defTenantEnterpriseSetupController.getDefEnterprise);
router.get(
  "/:tenant_id",
  defTenantEnterpriseSetupController.uniqueDefEnterprise
);
router.get(
  "/:page/:limit",
  defTenantEnterpriseSetupController.lazyLoadingDefEnterprise
);
router.post(
  "/:tenant_id",
  defTenantEnterpriseSetupController.createDefEnterprise
);
// router.put(
//   "/:tenant_id",
//   defTenantEnterpriseSetupController.updateDefEnterprise
// );
// router.put("/:id", defTenantsController.updateDefTenant);
router.delete(
  "/:tenant_id",
  defTenantEnterpriseSetupController.deleteDefEnterprise
);

module.exports = router;
