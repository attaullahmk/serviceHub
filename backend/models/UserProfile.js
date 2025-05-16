const mongoose = require("mongoose");
const validator = require("validator");

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  // profilePicture: {
  //   type: String,
  //   default: "https://images.pexels.com/photos/247851/pexels-photo-247851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   validate: {
  //     validator: function (url) {
  //       return /^(http|https):\/\/[^ "]+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  //     },
  //     message: "Invalid profile picture URL format. Allowed formats: jpg, jpeg, png, gif, webp",
  //   },
  // },
profilePicture: {
    type: String,
    validate: {
        validator: function (url) {
            // Only validate if a URL is provided
            if (!url) return true;
            return validator.isURL(url, {
                protocols: ["http", "https"],
                require_protocol: true,
                allow_underscores: true,
                allow_fragments: true,
                allow_trailing_dot: false,
                require_host: true,
            });
        },
        message: "Invalid profile picture URL format. Allowed formats: jpg, jpeg, png, gif, webp",
    },
    default: null, // <-- Ensure the default is null, not an empty string
},

  bio: {
    type: String,
    trim: true,
    default: "",
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  contactNumber: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  socialLinks: {
    facebook: { type: String, trim: true, default: "" },
    twitter: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
  },
  experience: {
    years: { type: Number, default: 0 },
    skills: [{ type: String, trim: true }],
  },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;
















// const mongoose = require("mongoose");

// const userProfileSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true,
//   },
//   profilePicture: {
//     type: String,
//     default: "default-profile.png",
//   },
//   bio: {
//     type: String,
//     trim: true,
//     default: "",
//   },
//   location: {
//     type: String,
//     trim: true,
//     default: "",
//   },
//   contactNumber: {
//     type: String,
//     trim: true,
//     default: "",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   // List of favorite services
//   favorites: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Service",
//     },
//   ],
//   // Social media links for providers
//   socialLinks: {
//     facebook: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     twitter: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     instagram: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     linkedin: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//   },
//   // Experience details for service providers
//   experience: {
//     years: {
//       type: Number,
//       default: 0,
//     },
//     skills: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],
//   },
// });

// const UserProfile = mongoose.model("UserProfile", userProfileSchema);
// module.exports = UserProfile;
