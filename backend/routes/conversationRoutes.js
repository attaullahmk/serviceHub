const express = require("express");
const { 
  createConversation, 
  getConversationsForUser, 
  getConversationById,  
  deleteConversationById, 
  getConversationBetweenUsers 
} = require("../controllers/conversationController");

const router = express.Router();

router.post("/", createConversation);
router.get("/:userId", getConversationsForUser);
router.get("/id/:id", getConversationById);
router.delete("/:id", deleteConversationById);

router.get("/:senderId/:receiverId", getConversationBetweenUsers);
// router.get("/between/:user1/:user2", getConversationBetweenUsers); // New route

module.exports = router;
