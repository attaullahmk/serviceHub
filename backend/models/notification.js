

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["booking", "review", "reminder", "update", "promotion" , "message"], // Type of notification
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true, // Not all notifications need a target
  },
  targetType: {
    type: String,
    enum: ["service", "booking", "review", "profile" , "message"], 
    // required: true,
  },
  isRead: {
    type: Boolean, 
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
