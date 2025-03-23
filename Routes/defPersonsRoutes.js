const Router = require("express");
const defPersonsController = require("../Controller/defPersonsController");

const router = Router();

// Routes
router.get("/", defPersonsController.defPersons);
router.get("/p", defPersonsController.perPagePersons);
router.get("/:id", defPersonsController.uniqueDefPerson);
router.post("/", defPersonsController.createDerPerson);
router.delete("/:id", defPersonsController.deleteDefPerson);
router.put("/:id", defPersonsController.updateDefPerson);

module.exports = router;
