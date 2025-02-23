const express = require("express");
const {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
} = require("../controllers/notificationController");
const { notificationSchema, partialNotificationSchema } = require("../schemas/notificationSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(notificationSchema), wrapAsync(createNotification));
router.get("/", wrapAsync(getAllNotifications));
router.get("/:id", wrapAsync(getNotificationById));
router.put("/:id", validateSchema(partialNotificationSchema), wrapAsync(updateNotificationById));
router.delete("/:id", wrapAsync(deleteNotificationById));

module.exports = router;
