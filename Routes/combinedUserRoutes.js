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
  "/update-profile-image/:id",
  // (req, res, next) => {
  //   console.log("Route reached before upload middleware.");
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
  //   console.log("File uploaded:", req.file); // Log file here
  //   next(); // Proceed to the next middleware
  // },
  generateThumbnail,
  combinedUserController.updateProfileImage
);

router.put("/:id", combinedUserController.updateUser);

//Flask API Wrapper
router.get("/v2", combinedUserController.getFlaskCombinedUser);
router.post("/v2", combinedUserController.createFlaskCombinedUser);

module.exports = router;
