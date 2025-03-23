const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Function to download image from a URL and save it
const downloadAndSaveImage = async (imageUrl, userName) => {
  try {
    const userFolder = path.join("./uploads/profiles", userName.toLowerCase());

    // Delete existing images in the user's folder
    if (fs.existsSync(userFolder)) {
      const files = await fs.promises.readdir(userFolder);
      for (const file of files) {
        const filePath = path.join(userFolder, file);
        const stat = await fs.promises.lstat(filePath);
        if (stat.isFile()) {
          await fs.promises.unlink(filePath);
        }
      }
    }

    // Ensure the user's folder exists
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    // Download the image
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const fileName = `profile-${Date.now()}.jpg`; // Generate a unique file name
    const filePath = path.join(userFolder, fileName).replace(/\\/g, "/");

    // Save the image to the user's folder
    fs.writeFileSync(filePath, response.data);

    return filePath; // Return the saved file path
  } catch (err) {
    console.error("Error downloading and saving image:", err);
    throw err;
  }
};
module.exports = downloadAndSaveImage;
