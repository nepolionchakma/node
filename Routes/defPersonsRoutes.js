const Router = require("express");
const defPersonsController = require("../Controller/defPersonsController");

const router = Router();

// Routes
router.get("/", defPersonsController.defPersons);
router.get("/:page/:limit", defPersonsController.lazyLoadingDefPersons);
router.get(
  "/search/:page/:limit",
  defPersonsController.searchLazyLoadingDefPersons
);
router.get("/:id", defPersonsController.uniqueDefPerson);
router.post("/", defPersonsController.createDerPerson);
router.put("/:id", defPersonsController.updateDefPerson);
router.delete("/:id", defPersonsController.deleteDefPerson);

module.exports = router;
