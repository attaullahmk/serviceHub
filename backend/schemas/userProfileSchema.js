const Joi = require("joi");

// 🔹 Full validation schema for creating or updating a user profile
const userProfileSchema = Joi.object({
  user: Joi.string().required(), // Reference to the user ID
  bio: Joi.string().max(500).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  address: Joi.string().max(100).optional(),
  website: Joi.string().uri().optional(),
  location: Joi.string().max(100).optional(),
  profilePicture: Joi.string().uri().optional(),
  favorites: Joi.array().items(Joi.string()).optional(), // Array of service IDs
});

// 🔹 Partial validation schema for updating a user profile
const partialUserProfileSchema = Joi.object({
  bio: Joi.string().max(500).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  address: Joi.string().max(100).optional(),
  website: Joi.string().uri().optional(),
  location: Joi.string().max(100).optional(),
  profilePicture: Joi.string().uri().optional(),
  favorites: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  userProfileSchema,
  partialUserProfileSchema,
};
