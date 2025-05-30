const UserProfile = require("../models/UserProfile");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const cloudinary = require("../config/cloudinary");

// 🔹 Create User Profile
// const createProfile = async (req, res) => {
//   const { userId } = req.params;
//   const profileData = req.body;

//   try {
//     // Ensure the user exists
//     const user = await User.findById(userId);
//     if (!user) throw new ExpressError(404, "User not found");

//     // Handle profile picture upload
//     if (req.file) {
//       profileData.profilePicture = req.file.path;
//     }

//     // Create a new profile
//     const userProfile = new UserProfile({ user: userId, ...profileData });
//     await userProfile.save();

//     res.status(201).json({
//       success: true,
//       message: "Profile created successfully",
//       profile: userProfile,
//     });
//   } catch (err) {
//     console.error("Profile creation error:", err);
//     res.status(err.statusCode || 500).json({
//       success: false,
//       message: err.message || "Server error",
//     });
//   }
// };


const createProfile = async (req, res) => {
    const { userId } = req.params;
    const profileData = req.body;

    try {
        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) throw new ExpressError(404, "User not found");

        // Handle profile picture upload
        if (req.file && req.file.path) {
            profileData.profilePicture = req.file.path;
        }

        // Create a new profile
        const userProfile = new UserProfile({ user: userId, ...profileData });
        await userProfile.save();

        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            profile: userProfile,
        });
    } catch (err) {
        console.error("Profile creation error:", err);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error",
        });
    }
};

// 🔹 Update User Profile
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const profileData = req.body;
  console.log("userId", userId);
  console.log("profileData", profileData);
  console.log("req.file", req.file);

  try {
    // Check if the profile exists
    const userProfile = await UserProfile.findOne({ user: userId });
    if (!userProfile) throw new ExpressError(404, "Profile not found");

    // Handle profile picture update
    if (req.file) {
      const newProfilePictureUrl = req.file.path;

      // Delete the old picture if it is not the default
      if (userProfile.profilePicture && !userProfile.profilePicture.includes("default-profile.png")) {
        const publicId = userProfile.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }

      // Update the profile picture
      profileData.profilePicture = newProfilePictureUrl;
    }

    // Update the profile data
    userProfile.set(profileData);
    await userProfile.save();
console.log("userProfile", userProfile);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: userProfile,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// 🔹 Get User Profile
const getProfile = async (req, res) => {
  const { userId } = req.params;
  console.log("userId to get profile ", userId);
  
  try {
    const userProfile = await UserProfile.findOne({ user: userId }).populate("favorites", "name description");
    if (!userProfile) throw new ExpressError(404, "Profile not found");

    res.status(200).json({
      success: true,
      profile: userProfile,
    });
  } catch (err) {
    console.error("Profile retrieval error:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// 🔹 Delete User Profile
const deleteProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const userProfile = await UserProfile.findOneAndDelete({ user: userId });
    if (!userProfile) throw new ExpressError(404, "Profile not found");

    // Delete the profile picture if it exists
    if (userProfile.profilePicture && !userProfile.profilePicture.includes("default-profile.png")) {
      const publicId = userProfile.profilePicture.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`services/${publicId}`);
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    console.error("Profile deletion error:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// 🔹 Add or Remove Favorite Service
const toggleFavorite = async (req, res) => {
  const { userId, serviceId } = req.params;

  try {
    const userProfile = await UserProfile.findOne({ user: userId });
    if (!userProfile) throw new ExpressError(404, "Profile not found");

    const serviceIndex = userProfile.favorites.indexOf(serviceId);
    if (serviceIndex === -1) {
      userProfile.favorites.push(serviceId);
      await userProfile.save();
      res.status(200).json({
        success: true,
        message: "Service added to favorites",
      });
    } else {
      userProfile.favorites.splice(serviceIndex, 1);
      await userProfile.save();
      res.status(200).json({
        success: true,
        message: "Service removed from favorites",
      });
    }
  } catch (err) {
    console.error("Favorite toggle error:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

module.exports = {
  createProfile,
  updateProfile,
  getProfile,
  deleteProfile,
  toggleFavorite,
};































// const UserProfile = require("../models/UserProfile");
// const User = require("../models/user");
// const ExpressError = require("../utils/ExpressError");
// // const UserProfile = require("../models/UserProfile");
// // const ExpressError = require("../utils/ExpressError");
// const cloudinary = require("../config/cloudinary");

// const createOrUpdateProfile = async (req, res) => {
//   const { userId } = req.params;
//   const profileData = req.body;

//   try {
//     // Check if the user profile exists
//     let userProfile = await UserProfile.findOne({ user: userId });

//     // Handle profile picture upload
//     if (req.file) {
//       const profilePictureUrl = req.file.path;

//       // If updating, remove the old picture
//       if (userProfile?.profilePicture && !userProfile.profilePicture.includes("default-profile.png")) {
//         const publicId = userProfile.profilePicture.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(`services/${publicId}`);
//       }

//       profileData.profilePicture = profilePictureUrl;
//     }

//     if (userProfile) {
//       // Update existing profile
//       userProfile.set(profileData);
//       await userProfile.save();
//     } else {
//       // Create a new profile
//       userProfile = new UserProfile({ user: userId, ...profileData });
//       await userProfile.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       profile: userProfile,
//     });
//   } catch (err) {
//     console.error("Profile update error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message || "Server error",
//     });
//   }
// };




// // 🔹 Get User Profile
// const getProfile = async (req, res) => {
//   const { userId } = req.params;
// console.log("userId", userId)
// console.log("userId", req.params)
//   try {
//     const userProfile = await UserProfile.findOne({ user: userId }).populate("favorites", "name description");
//      console.log("userProfile:", userProfile); // Check if this logs
//     if (!userProfile) {
//       throw new ExpressError(404, "Profile not found");
//     }

//     res.status(200).json({
//       success: true,
//       profile: userProfile,
//     });
//   } catch (err) {
//     res.status(err.statusCode || 500).json({
//       success: false,
//       message: err.message || "Server error",
//     });
//   }
// };

// // 🔹 Delete User Profile
// const deleteProfile = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const userProfile = await UserProfile.findOneAndDelete({ user: userId });
//     if (!userProfile) {
//       throw new ExpressError(404, "Profile not found");
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile deleted successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || 500).json({
//       success: false,
//       message: err.message || "Server error",
//     });
//   }
// };

// // 🔹 Add or Remove Favorite Service
// const toggleFavorite = async (req, res) => {
//   const { userId, serviceId } = req.params;

//   try {
//     const userProfile = await UserProfile.findOne({ user: userId });
//     if (!userProfile) {
//       throw new ExpressError(404, "Profile not found");
//     }

//     const serviceIndex = userProfile.favorites.indexOf(serviceId);
//     if (serviceIndex === -1) {
//       // Add to favorites if not already added
//       userProfile.favorites.push(serviceId);
//       await userProfile.save();
//       res.status(200).json({
//         success: true,
//         message: "Service added to favorites",
//       });
//     } else {
//       // Remove from favorites if already added
//       userProfile.favorites.splice(serviceIndex, 1);
//       await userProfile.save();
//       res.status(200).json({
//         success: true,
//         message: "Service removed from favorites",
//       });
//     }
//   } catch (err) {
//     res.status(err.statusCode || 500).json({
//       success: false,
//       message: err.message || "Server error",
//     });
//   }
// };

// module.exports = {
//   createOrUpdateProfile,
//   getProfile,
//   deleteProfile,
//   toggleFavorite,
// };




