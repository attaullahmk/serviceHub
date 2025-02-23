const Joi = require("joi");

const bookingSchema = Joi.object({
  user: Joi.string().required(), // User ID
  service: Joi.string().required(), // Service ID
  provider: Joi.string().required(), // Provider ID
  bookingDate: Joi.date().required(),
  totalPrice: Joi.number().min(0).required(),
});

const partialBookingSchema = Joi.object({
  status: Joi.string().valid("pending", "confirmed", "completed", "cancelled").required(),
});

module.exports = { bookingSchema, partialBookingSchema };
