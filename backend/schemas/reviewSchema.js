const Joi = require("joi");

// Full validation schema
const reviewSchema = Joi.object({
  serviceId: Joi.string().required(),
  userId: Joi.string().required(),
  comment: Joi.string().max(500).optional(),
  rating: Joi.number().min(1).max(5).required(),
});

// Partial validation schema for updates
const partialReviewSchema = reviewSchema.fork(Object.keys(reviewSchema.describe().keys), (field) =>
  field.optional()
);

module.exports = {
  reviewSchema,
  partialReviewSchema,
};
