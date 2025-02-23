const Joi = require("joi");

// Full validation schema for ServiceProvider
const serviceProviderSchema = Joi.object({
  // Reference to the User document (object id as string)
  user: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\d{10,15}$/) // Ensures phone number contains only digits (10-15 length)
    .required(),
  address: Joi.string().min(5).required(),
  services: Joi.array().items(Joi.string().trim().min(2)).min(1).required(),
  availability: Joi.boolean().truthy("true").falsy("false").optional(), // Auto-converts string "true"/"false" to boolean
  ratings: Joi.number().min(0).max(5).optional(),
  reviews: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        comment: Joi.string().optional(),
        rating: Joi.number().min(0).max(5).optional(),
      })
    )
    .optional(),
});

// Partial validation schema for updates (all fields optional)
const partialServiceProviderSchema = serviceProviderSchema.fork(
  Object.keys(serviceProviderSchema.describe().keys),
  (field) => field.optional()
);

module.exports = {
  serviceProviderSchema,
  partialServiceProviderSchema,
};
