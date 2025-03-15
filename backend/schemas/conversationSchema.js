const Joi = require("joi");

const conversationSchema = Joi.object({
  participants: Joi.array().items(Joi.string().required()).min(2).required(), // At least two participant IDs
  service: Joi.string().optional(), // Service ID (optional if the conversation is general)
});

module.exports = { conversationSchema };
