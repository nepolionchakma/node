const Router = require("express");
const defUserCredentialsController = require("../Controller/defUserCrendentialsController");

const router = Router();

router.get("/", defUserCredentialsController.getDefUserCredentials);
router.get(
  "/:user_id",
  defUserCredentialsController.getUniqueDefUserCredentials
);
router.post("/", defUserCredentialsController.createDefUserCredential);
router.put(
  "/reset-password/:user_id",
  defUserCredentialsController.resetPassword
);
router.delete(
  "/:user_id",
  defUserCredentialsController.deleteDefUserCredential
);

module.exports = router;
