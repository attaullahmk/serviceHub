const Message = require("../models/message");
const Conversation = require("../models/conversation");
const ExpressError = require("../utils/ExpressError");

// Create a new message in a conversation
const createMessage = async (req, res) => {
  try {
    const { conversationId, sender, receiver, content } = req.body;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) { 
      throw new ExpressError(404, "Conversation not found");
    }

    // Create and save the message
    const message = new Message({  
      conversationId,
      sender,
      receiver,
      content,
    });

    await message.save();

    // Update the conversation's `updatedAt` field
    conversation.updatedAt = Date.now();
    await conversation.save();

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Get all messages in a conversation
const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("sender", "name email")
      .populate("receiver", "name email"); // Added receiver

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a specific message by ID
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id)
      .populate("sender", "name email")
      .populate("receiver", "name email"); // Added receiver

    if (!message) {
      throw new ExpressError(404, "Message not found");
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a specific message by ID
const updateMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isRead } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      throw new ExpressError(404, "Message not found");
    }

    if (content !== undefined) message.content = content;
    if (isRead !== undefined) message.isRead = isRead;

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a specific message by ID
const deleteMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      throw new ExpressError(404, "Message not found");
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createMessage,
  getMessagesByConversation,
  getMessageById,
  updateMessageById,
  deleteMessageById,
};
