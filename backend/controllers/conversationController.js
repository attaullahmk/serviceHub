const Conversation = require("../models/conversation"); 
const ExpressError = require("../utils/ExpressError");

// Create a new conversation
const createConversation = async (req, res) => { 
  console.log("create", req.body);
  
  const { participants, service } = req.body;    
  console.log(participants.length);
 
  if (!participants || participants.length < 2) { 
    throw new ExpressError(400, "A conversation requires at least two participants.");
  }

  // Check if a conversation already exists for the same participants and service
  const existingConversation = await Conversation.findOne({ 
    participants: { $all: participants },
    service: service || null, // Ensures it checks conversations specific to the same service
  });

  if (existingConversation) {
    return res.status(200).json({
      success: true,
      message: "Conversation already exists",
      data: existingConversation,
    });
  }

  const conversation = new Conversation({ participants, service });
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

  const conversations = await Conversation.find({ participants: userId })
    .populate("participants", "name email")
    .populate("service", "title description"); // Populate service details

  res.status(200).json({
    success: true,
    data: conversations,
  });
}; 

// Get all conversations where the user is a sender and a specific service ID is involved
const getConversationsBySenderAndService = async (req, res) => {
  const { senderId, serviceId } = req.params;

  try {
    const conversations = await Conversation.find({
      participants: senderId,
      service: serviceId,
    })
      .populate("participants", "name email")
      .populate("service", "title description");

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get a specific conversation by ID
const getConversationById = async (req, res) => {
  const { id } = req.params; 
  console.log(id);

  const conversation = await Conversation.findById(id)
    .populate("participants", "name email")
    .populate("service", "title description");

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

// Get a conversation between two users (sender and receiver) about a specific service
const getConversationBetweenUsers = async (req, res) => {
  const { senderId, receiverId, serviceId } = req.params; 

  try {
    const query = {
      participants: { $all: [senderId, receiverId] },
    };

    if (serviceId) {
      query.service = serviceId;
    }

    const conversation = await Conversation.findOne(query)
      .populate("participants", "name email")
      .populate("service", "title description");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "No conversation found between these users for this service",
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
  getConversationsBySenderAndService,
  getConversationById,
  deleteConversationById,
  getConversationBetweenUsers,
};
