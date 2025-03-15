const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References users involved in the conversation
        required: true,
      },
    ],
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // References the specific service listing
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
