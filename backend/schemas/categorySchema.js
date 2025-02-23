const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
});

const partialCategorySchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
});

module.exports = { categorySchema, partialCategorySchema };
