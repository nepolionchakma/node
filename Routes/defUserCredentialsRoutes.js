const Router = require("express");
const defUserCredentialsController = require("../Controller/defUserCrendentials");

const router = Router();

router.get("/", defUserCredentialsController.getDefUserCredentials);
router.get(
  "/:user_id",
  defUserCredentialsController.getUniqueDefUserCredentials
);
router.post("/", defUserCredentialsController.createDefUserCredential);
router.put("/reset-password", defUserCredentialsController.resetPassword);
router.put("/:user_id", defUserCredentialsController.updateDefUserCredential);
router.delete(
  "/:user_id",
  defUserCredentialsController.deleteDefUserCredential
);

module.exports = router;
