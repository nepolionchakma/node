const Router = require("express");
const openbaoController = require("../Controller/openbaoController");

const router = Router();

router.get("/get_secrets_engines", openbaoController.getSecretsEngines);
router.get("/get_latest_secret", openbaoController.getLatestSecret);
router.post("/create_secrets_engine", openbaoController.createSecretsEngine);
router.post("/store_secret", openbaoController.storeSecret);
router.put("/update_secrets_engine", openbaoController.updateSecretsEngine);
router.put("/update_secret", openbaoController.updateSecret);
// router.delete("/deleteEngine", openbaoController.deleteEngine);

module.exports = router;
