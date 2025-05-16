const express = require("express");
const {
  createProfile,
  updateProfile,
  getProfile,
  deleteProfile,
  toggleFavorite,
} = require("../controllers/userProfileController");
const { userProfileSchema, partialUserProfileSchema } = require("../schemas/userProfileSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");
const upload = require("../middlewares/multer");
const router = express.Router();

// 🔹 Create User Profile
router.post(
  "/:userId",
  // upload.single("profilePicture"),
  // validateSchema(userProfileSchema),
  wrapAsync(createProfile)
);

// 🔹 Update User Profile (Partial Update)
router.put(
  "/:userId",
  upload.single("profilePicture"),
  // validateSchema(partialUserProfileSchema),
  wrapAsync(updateProfile)
);

// 🔹 Get User Profile
router.get(
  "/:userId",
  wrapAsync(getProfile)
);

// 🔹 Delete User Profile
router.delete(
  "/:userId",
  wrapAsync(deleteProfile)
);

// 🔹 Add or Remove Favorite Service
router.patch(
  "/:userId/favorites/:serviceId",
  wrapAsync(toggleFavorite)
);

module.exports = router;
