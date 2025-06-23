const Notification = require("../models/notification");
const ExpressError = require("../utils/ExpressError");

// Create a new notification
const createNotification = async (req, res) => {
  const { recipient, type, message, targetId, targetType } = req.body;
console.log("req.body ", req.body);
  const notification = new Notification({
    recipient,
    type,
    message,
    targetId,
    targetType,
    isRead: false, // Notifications are unread by default
  });
 console.log("notification ", notification);
  await notification.save();

  res.status(201).json({
    success: true,
    message: "Notification created successfully",
    notification,
  });
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find().populate("recipient", "name email");

  res.status(200).json({
    success: true,
    notifications,
  });
};

// Get a single notification by ID
const getNotificationById = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id).populate("recipient", "name email");

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

// Get notifications for a specific user (recipient)
const getNotificationsForUser = async (req, res) => {
  const userId = req.user?._id || req.params.userId;
console.log("userId for notaficon  ", userId);
  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("recipient", "name email");

  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications,
  });
};

// Mark all notifications as read for a specific user
const markAllAsRead = async (req, res) => {
  const { userId } = req.params;
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} notifications marked as read`,
  });
};

// ✅ Mark a single notification as read (on click)
const markNotificationAsRead = async (req, res) => {
  const { userId, notificationId } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new ExpressError(404, "Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    notification,
  });
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
  getNotificationsForUser,
  markAllAsRead,
  markNotificationAsRead, // ✅ add this line
};
