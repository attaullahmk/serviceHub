const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const allowedFormats = ["jpg", "png", "jpeg", "webp"]; // Supported formats
    const fileFormat = file.mimetype.split("/")[1]; // Extract file extension

    return {
      folder: "services",
      format: allowedFormats.includes(fileFormat) ? fileFormat : "jpg", // Default to JPG if format not allowed
      public_id: file.originalname.replace(/\s+/g, "_").split(".")[0], // Remove spaces & extension
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
