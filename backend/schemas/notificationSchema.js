// const Joi = require("joi");

// // Full validation schema
// const notificationSchema = Joi.object({
//   recipient: Joi.string().required(),
//   type: Joi.string()
//     .valid("booking", "review", "reminder", "update", "promotion")
//     .required(),
//   message: Joi.string().max(500).required(),
//   isRead: Joi.boolean().optional(),
// });

// // Partial validation schema for updates
// const partialNotificationSchema = notificationSchema.fork(Object.keys(notificationSchema.describe().keys), (field) =>
//   field.optional()
// );

// module.exports = {
//   notificationSchema,
//   partialNotificationSchema,
// };


const Joi = require("joi");

// Full validation schema for creating notifications
const notificationSchema = Joi.object({
  recipient: Joi.string().required(),
  type: Joi.string()
    .valid("booking", "review", "reminder", "update", "promotion")
    .required(),
  message: Joi.string().max(500).required(),
  targetId: Joi.string().optional(), // Not all notifications need a target
  targetType: Joi.string()
    .valid("service", "booking", "review", "profile")
    .optional(),
  isRead: Joi.boolean().optional(),
  // createdAt: Joi.date().default(() => new Date(), "current date"),
});

// Partial validation schema for updates
const partialNotificationSchema = notificationSchema.fork(
  Object.keys(notificationSchema.describe().keys),
  (field) => field.optional()
);

module.exports = {
  notificationSchema,
  partialNotificationSchema,
};
