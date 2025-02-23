const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String, // Helps group FAQs into categories (e.g., "User Support", "Service Provider Help")
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
