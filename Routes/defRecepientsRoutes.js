const router = require("express").Router();

const recepientsController = require("../Controller/defRecepientsController");

router.post("/", recepientsController.createRecepients);
router.get("/", recepientsController.recepients);
router.get("/:alert_id/:user_id", recepientsController.getUniqueRecepient);
router.put("/:alert_id/:user_id", recepientsController.updateRecepient);
router.delete("/:alert_id/:user_id", recepientsController.removeRecepient);

module.exports = router;
