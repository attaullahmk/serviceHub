const Joi = require("joi");

// Schema for creating a new message
const messageSchema = Joi.object({
  conversationId: Joi.string().required(), // ID of the conversation
  sender: Joi.string().required(), // Sender's user ID
  receiver: Joi.string().required(), // Receiver's user ID (Added this field)
  content: Joi.string().required().min(1), // Message content must not be empty
});

// Schema for partial updates (updating only specific fields)
const partialMessageSchema = Joi.object({
  content: Joi.string().min(1), // Optional: Updated content
  isRead: Joi.boolean(), // Optional: Updated read status
}).or("content", "isRead"); // Ensure at least one field is being updated

module.exports = { messageSchema, partialMessageSchema };
