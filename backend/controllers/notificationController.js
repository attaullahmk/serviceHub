const Notification = require("../models/notification");
const ExpressError = require("../utils/ExpressError");

// Create a new notification
const createNotification = async (req, res) => {
  const { recipient, type, message, isRead } = req.body;

  const notification = new Notification({
    recipient,
    type,
    message,
    isRead,
  });

  await notification.save();

  res.status(201).json({
    success: true,
    message: "Notification created successfully",
    notification,
  });
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find()
    .populate("recipient", "name email");

  res.status(200).json({
    success: true,
    notifications,
  });
};

// Get a single notification by ID
const getNotificationById = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id)
    .populate("recipient", "name email");

  if (!notification) {
    throw new ExpressError(404, "Notification not found");
  }

  res.status(200).json({
    success: true,
    notification,
  });
};

// Update a notification by ID
const updateNotificationById = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!notification) {
    throw new ExpressError(404, "Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification updated successfully",
    notification,
  });
};

// Delete a notification by ID
const deleteNotificationById = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    throw new ExpressError(404, "Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
};
