const validateSchema = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
  
      if (error) {
        // Respond with a 400 Bad Request and the validation error details
        return res.status(400).json({
          success: false,
          message: "Validation error",
          details: error.details.map((detail) => detail.message),
        });
      }
  
      next(); // Proceed to the next middleware or controller
    };
  };
  
  module.exports = validateSchema;
  