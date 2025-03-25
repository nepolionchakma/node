const Router = require("express");
const authentication = require("../Authentication/Authentication");

const router = Router();

router.post("/", authentication.login);
router.get("/", authentication.logout);
router.get("/user", authentication.user);
router.get("/refresh-token", authentication.refreshToken);

module.exports = router;
