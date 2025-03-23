const Router = require("express");
const defUsersController = require("../Controller/defUsersController");

const router = Router();

router.get("/", defUsersController.getDefUsers);
router.get("/p", defUsersController.perPageUsers);
router.get("/:user_id", defUsersController.getUniqueDefUser);
router.post("/", defUsersController.createDefUser);
router.put("/:user_id", defUsersController.updateDefUser);
router.delete("/:user_id", defUsersController.deleteDefUser);

module.exports = router;
