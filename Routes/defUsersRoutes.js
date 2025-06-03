const Router = require("express");
const defUsersController = require("../Controller/defUsersController");

const router = Router();

router.get("/", defUsersController.getDefUsers);
router.get("/:page/:limit", defUsersController.lazyLoadingDefUsers);
router.get(
  "/search/:page/:limit",
  defUsersController.searchLazyLoadingDefUsers
);
router.get("/:user_id", defUsersController.getUniqueDefUser);
router.post("/", defUsersController.createDefUser);
router.put("/:user_id", defUsersController.updateDefUser);
router.delete("/:user_id", defUsersController.deleteDefUser);

module.exports = router;
