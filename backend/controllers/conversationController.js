const Conversation = require("../models/conversation");
const ExpressError = require("../utils/ExpressError");

// Create a new conversation

const createConversation = async (req, res) => { 
  console.log( "create", req.body);
  
  const { participants } = req.body;    
  console.log(participants.length);
 
  if (!participants || participants.length < 2) { 
    throw new ExpressError(400, "A conversation requires at least two participants.");
  }

  // Check if a conversation already exists
  const existingConversation = await Conversation.findOne({ 
    participants: { $all: participants } 
  });

  if (existingConversation) {
    return res.status(200).json({
      success: true,
      message: "Conversation already exists",
      data: existingConversation,
    });
  }

  const conversation = new Conversation({ participants });
  await conversation.save();

  res.status(201).json({
    success: true,
    message: "Conversation created successfully",
    data: conversation,
  });
};


// Get all conversations for a user
const getConversationsForUser = async (req, res) => {
  const { userId } = req.params;

  const conversations = await Conversation.find({ participants: userId }).populate(
    "participants",
    "name email"
  );

  res.status(200).json({
    success: true,
    data: conversations,
  });
}; 

// Get a specific conversation by ID
const getConversationById = async (req, res) => {

  const { id } = req.params; 
  console.log(id)

  const conversation = await Conversation.findById(id).populate("participants", "name email");

  if (!conversation) {
    throw new ExpressError(404, "Conversation not found");
  }

  res.status(200).json({
    success: true,
    data: conversation, 
  });
}; 

// Delete a conversation by ID
const deleteConversationById = async (req, res) => {
  const { id } = req.params;

  const conversation = await Conversation.findByIdAndDelete(id);

  if (!conversation) {
    throw new ExpressError(404, "Conversation not found");
  }

  res.status(200).json({
    success: true,
    message: "Conversation deleted successfully",
  });
};

 
// Get a conversation between two users (sender and receiver)
const getConversationBetweenUsers = async (req, res) => {
  const { senderId, receiverId } = req.params; 
  // console.log( "conversation ", req.params)

  try {
    const conversation = await Conversation.findOne({ 
      participants: { $all: [senderId, receiverId] },
    }).populate("participants", "name email");
    console.log("converstaion ", conversation)

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "No conversation found between these users",
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



module.exports = {
  createConversation,
  getConversationsForUser,
  getConversationById,
  deleteConversationById,
  getConversationBetweenUsers, // Add this function to exports
};



