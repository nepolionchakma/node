const Router = require("express");
const combinedUserController = require("../Controller/combinedUserController");
// upload profile image middleware
const { upload, generateThumbnail } = require("../Middleware/multerUpload");
const router = Router();

// combined users get with page and limit
router.get("/:page/:limit", combinedUserController.getUsersWithPageAndLimit);
router.get(
  "/search/:page/:limit",
  combinedUserController.searchUsersWithPageAndLimit
);
// combined users get without page and limit
router.get("/", combinedUserController.getUsersView);
router.get("/:user_id", combinedUserController.getUser);
router.post("/", combinedUserController.createCombinedUser);
router.put(
  "/update-profile-image/:user_id",
  // (req, res, next) => {

  //   next();
  // },
  upload.single("profileImage"), // The actual file upload middleware
  // (err, req, res, next) => {
  //   if (err) {
  //     console.error("Multer error:", err); // Catch any multer errors
  //     return res.status(400).send(err.message); // Send error response
  //   }
  //   next(); // Proceed to the next middleware
  // },
  // (req, res, next) => {

  //   next(); // Proceed to the next middleware
  // },
  generateThumbnail,
  combinedUserController.updateProfileImage
);

router.put("/:user_id", combinedUserController.updateUser);

//Flask API Wrapper
router.get("/v2", combinedUserController.getFlaskCombinedUser);
router.post("/v2", combinedUserController.createFlaskCombinedUser);

module.exports = router;
