const Joi = require("joi");

// Full validation schema
const notificationSchema = Joi.object({
  recipient: Joi.string().required(),
  type: Joi.string()
    .valid("booking", "review", "reminder", "update", "promotion")
    .required(),
  message: Joi.string().max(500).required(),
  isRead: Joi.boolean().optional(),
});

// Partial validation schema for updates
const partialNotificationSchema = notificationSchema.fork(Object.keys(notificationSchema.describe().keys), (field) =>
  field.optional()
);

module.exports = {
  notificationSchema,
  partialNotificationSchema,
};
