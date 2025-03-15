const express = require("express");
const { 
  createConversation, 
  getConversationsForUser, 
  getConversationById,  
  deleteConversationById, 
  getConversationBetweenUsers,
  getConversationsBySenderAndService
} = require("../controllers/conversationController");
 
const router = express.Router();

router.post("/", createConversation);
router.get("/:userId", getConversationsForUser);
router.get("/id/:id", getConversationById);
router.delete("/:id", deleteConversationById);

// Updated route to optionally include a service ID
router.get("/:senderId/:receiverId/:serviceId?", getConversationBetweenUsers);

// Route to get all conversations where a user is a sender and a specific service ID is involved
router.get("/sender/:senderId/service/:serviceId", getConversationsBySenderAndService);

module.exports = router;
