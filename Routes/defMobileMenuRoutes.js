const Router = require("express");
const mobileMenuController = require("../Controller/defMobileMenuController");

const router = Router();

router.get("/", mobileMenuController.getMobileMenu);
router.post("/", mobileMenuController.createMobileMenu);
router.put("/:id", mobileMenuController.updateMobileMenu);

module.exports = router;
