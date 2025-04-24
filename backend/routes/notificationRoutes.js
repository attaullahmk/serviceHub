const express = require("express");
const {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
  getNotificationsForUser,
  markAllAsRead, // ✅ import the new controller
} = require("../controllers/notificationController");

const {
  notificationSchema,
  partialNotificationSchema,
} = require("../schemas/notificationSchema");

const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");
// const authenticateJWT = require("../middlewares/authenticateJWT"); // Optional if you want auth

const router = express.Router();

// ✅ Main CRUD Routes
router.post("/", validateSchema(notificationSchema), wrapAsync(createNotification));
router.get("/", wrapAsync(getAllNotifications));
router.get("/:id", wrapAsync(getNotificationById));
router.put("/:id", validateSchema(partialNotificationSchema), wrapAsync(updateNotificationById));
router.delete("/:id", wrapAsync(deleteNotificationById));

// ✅ Get all notifications for a user
router.get("/user/:userId", wrapAsync(getNotificationsForUser));

// ✅ Mark all as read for a user
router.put("/markAllAsRead/:userId", wrapAsync(markAllAsRead));

module.exports = router;
