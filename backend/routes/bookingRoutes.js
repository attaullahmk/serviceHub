const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBookingById,
  getUserBookings,
  getProviderBookings, // ✅ Added
} = require("../controllers/bookingController");
const { bookingSchema, partialBookingSchema } = require("../schemas/bookingSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(bookingSchema), wrapAsync(createBooking));
router.get("/", wrapAsync(getAllBookings));
router.get("/user/:userId", wrapAsync(getUserBookings));
router.get("/provider/:providerId", wrapAsync(getProviderBookings)); // ✅ Added here
router.get("/:id", wrapAsync(getBookingById));
router.patch("/:id/status", validateSchema(partialBookingSchema), wrapAsync(updateBookingStatus));
router.delete("/:id", wrapAsync(deleteBookingById));

module.exports = router;
