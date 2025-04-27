const Joi = require("joi");

// Full validation schema
const reviewSchema = Joi.object({
  serviceId: Joi.string().required(), // ID of the service
  userId: Joi.string().required(), // ID of the user
  comment: Joi.string().max(500).optional(), // Optional comment, max 500 chars
  rating: Joi.number().min(1).max(5).required(), // Rating must be between 1 and 5
  reactions: Joi.object({
    helpful: Joi.array().items(Joi.string().hex().length(24)).default([]), // Array of ObjectIds for 'helpful' reactions
    thanks: Joi.array().items(Joi.string().hex().length(24)).default([]), // Array of ObjectIds for 'thanks' reactions
    loveThis: Joi.array().items(Joi.string().hex().length(24)).default([]), // Array of ObjectIds for 'loveThis' reactions
    ohNo: Joi.array().items(Joi.string().hex().length(24)).default([]), // Array of ObjectIds for 'ohNo' reactions
  }).default({
    helpful: [],
    thanks: [],
    loveThis: [],
    ohNo: [],
  }),
});

// Partial validation schema for updates (to allow partial fields)
const partialReviewSchema = reviewSchema.fork(Object.keys(reviewSchema.describe().keys), (field) =>
  field.optional()
);

module.exports = {
  reviewSchema,
  partialReviewSchema,
};
