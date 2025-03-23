const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");

const UPLOAD_FOLDER = "./uploads/profiles";

// Ensure the base upload directory exists
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

// Function to delete existing images
const deleteExistingImages = async (folderPath) => {
  if (fs.existsSync(folderPath)) {
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.lstat(filePath);
      if (stat.isFile()) {
        await fs.promises.unlink(filePath);
      }
    }
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userFolder = path.join(
        UPLOAD_FOLDER,
        req.user.user_name.toLowerCase()
      );

      // Delete existing images in the user's folder
      await deleteExistingImages(userFolder);

      // Ensure the user's folder exists
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      cb(null, userFolder); // Set upload directory
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-"); // Replace spaces with "-"
    cb(null, `${baseName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500000 }, // 500 KB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

// Middleware to generate a compressed thumbnail
const generateThumbnail = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const userFolder = path.join(
      UPLOAD_FOLDER,
      req.user.user_name.toLowerCase()
    );
    const filePath = path.join(userFolder, req.file.filename);
    const thumbnailPath = path.join(userFolder, "thumbnail.jpg");

    // Ensure user folder exists
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    let quality = 80; // Start with high quality
    let buffer = await sharp(filePath)
      .resize({ withoutEnlargement: true }) // Keep original size
      .jpeg({ quality }) // Initial compression
      .toBuffer();

    // Reduce quality step-by-step until the size is ≤ 10KB
    while (buffer.length > 10 * 1024 && quality > 10) {
      quality -= 5;
      buffer = await sharp(filePath)
        .resize({ withoutEnlargement: true })
        .jpeg({ quality })
        .toBuffer();
    }

    // Save compressed thumbnail
    await sharp(buffer).toFile(thumbnailPath);

    req.file.thumbnailPath = thumbnailPath.replace(/\\/g, "/"); // Store thumbnail path
    next();
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    next(error);
  }
};

module.exports = { upload, generateThumbnail };
