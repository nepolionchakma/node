const Router = require("express");
const defTenantsController = require("../Controller/defTenanantsController");

const router = Router();

router.get("/", defTenantsController.defTenants);
router.get("/:id", defTenantsController.uniqueDefTenant);
router.get("/:page/:limit", defTenantsController.defTenantWithLazyLoading);
router.post("/", defTenantsController.createDefTenant);
router.put("/:id", defTenantsController.updateDefTenant);
router.delete("/:id", defTenantsController.deleteDefTenant);
// router.post("/upsert", defTenantsController.upsertDefTenant);

module.exports = router;
