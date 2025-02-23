const Joi = require("joi");

const faqSchema = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),
  category: Joi.string().trim(),
});

const partialFAQSchema = Joi.object({
  question: Joi.string().trim(),
  answer: Joi.string().trim(),
  category: Joi.string().trim(),
});

module.exports = { faqSchema, partialFAQSchema };
