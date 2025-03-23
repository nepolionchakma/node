const Router = require("express");
const authentication = require("../Authentication/Authentication");

const router = Router();

router.get("/server", (req, res) => {
  res.send("Server is running");
});
router.post("/", authentication.login);
router.get("/", authentication.logout);
router.get("/user", authentication.user);
router.get("/refresh-token", authentication.refreshToken);

module.exports = router;
