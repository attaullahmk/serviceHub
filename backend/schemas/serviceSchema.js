const Joi = require("joi");

// Define the base schema for service validation
const serviceSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  availability: Joi.boolean().required(), // Changed to boolean (true/false)
  provider: Joi.string().required(),
  address: Joi.string().min(5).max(200).required(), 

  // ✅ Image gallery (Array of valid URLs)
  imageGallery: Joi.array().items(Joi.string().uri()).optional(),

  // ✅ New Fields for Top-Rated Services
  views: Joi.number().min(0).default(0), // Track number of views
  totalReviews: Joi.number().min(0).default(0), // Number of reviews
  engagementScore: Joi.number().min(0).default(0), // Engagement score for ranking
  averageRating: Joi.number().min(0).max(5).default(0), // Rating between 0-5
});

// Create a partial schema for updates (all fields optional)
const partialServiceSchema = serviceSchema.fork(
  Object.keys(serviceSchema.describe().keys),
  (field) => field.optional()
);

module.exports = {
  serviceSchema,
  partialServiceSchema,
};
