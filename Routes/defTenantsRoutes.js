const Router = require("express");
const defTenantsController = require("../Controller/defTenanantsController");

const router = Router();

router.get("/", defTenantsController.defTenants);
router.get("/:id", defTenantsController.uniqueDefTenant);
router.post("/", defTenantsController.createDefTenant);
router.post("/upsert", defTenantsController.upsertDefTenant);
router.delete("/:id", defTenantsController.deleteDefTenant);
router.put("/:id", defTenantsController.updateDefTenant);

module.exports = router;
