const Joi = require("joi");

const conversationSchema = Joi.object({
  participants: Joi.array().items(Joi.string().required()).min(2).required(), // At least two participant IDs
});

module.exports = { conversationSchema };
