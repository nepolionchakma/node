const Router = require("express");
const combinedUserController = require("../Controller/combinedUserController");
// upload profile image middleware
const { upload, generateThumbnail } = require("../Middleware/multerUpload");
const router = Router();

// combined users get with page and limit
router.get("/:page/:limit", combinedUserController.getUsersWithPageAndLimit);
// combined users get without page and limit
router.get("/", combinedUserController.getUsersView);
router.get("/:id", combinedUserController.getUser);
router.post("/", combinedUserController.createCombinedUser);

router.put(
  "/:id",
  upload.single("profileImage"),
  generateThumbnail,
  combinedUserController.updateUser
);

//Flask API Wrapper
router.get("/v2", combinedUserController.getFlaskCombinedUser);
router.post("/v2", combinedUserController.createFlaskCombinedUser);

module.exports = router;
