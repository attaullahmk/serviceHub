const Joi = require("joi");

// Full validation schema for creating a user
const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).when("googleId", {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }), // Password is required unless `googleId` exists
  googleId: Joi.string().optional(), // Optional for Google OAuth users
  role: Joi.string().valid("user", "provider", "admin").optional(),
});

// Partial validation schema for updating a user
const partialUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  googleId: Joi.forbidden(), // Prevent updating `googleId`
  role: Joi.string().valid("user", "provider", "admin").optional(),
});

module.exports = {
  userSchema,
  partialUserSchema,
};
