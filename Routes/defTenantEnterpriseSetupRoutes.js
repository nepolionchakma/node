const Router = require("express");
const defTenantEnterpriseSetupController = require("../Controller/defTenantEnterpriseSetupController");

const router = Router();

router.get("/", defTenantEnterpriseSetupController.defTenantEnterpriseSetup);
router.get(
  "/:page/:limit",
  defTenantEnterpriseSetupController.defTenantEnterpriseSetupLazyLoading
);

module.exports = router;
