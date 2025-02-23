const express = require("express");
const {
  createMessage,
  getMessagesByConversation,
  getMessageById,
  updateMessageById,
  deleteMessageById,
} = require("../controllers/messageController");
const { messageSchema, partialMessageSchema } = require("../schemas/messageSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Create a new message in a conversation
router.post("/", validateSchema(messageSchema), wrapAsync(createMessage));

// Get all messages for a specific conversation
router.get("/conversation/:conversationId", wrapAsync(getMessagesByConversation));

// Get a specific message by ID
router.get("/:id", wrapAsync(getMessageById)); 

// Update a specific message by ID
router.put("/:id", validateSchema(partialMessageSchema), wrapAsync(updateMessageById));

// Delete a specific message by ID
router.delete("/:id", wrapAsync(deleteMessageById));

module.exports = router;
