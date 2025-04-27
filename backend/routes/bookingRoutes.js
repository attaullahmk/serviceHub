const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBookingById,
  getUserBookings,
  getProviderBookings, // ✅ Already added
  updateBookingIsDeleted, // ✅ Soft delete controller added
  createBookingRequest,
} = require("../controllers/bookingController");

const { bookingSchema, partialBookingSchema } = require("../schemas/bookingSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");
const authenticateJWT = require("../middlewares/authenticateJWT");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(bookingSchema), wrapAsync(createBooking));
router.get("/", wrapAsync(getAllBookings));
router.get("/user/:userId", wrapAsync(getUserBookings));
router.post("/bookings", wrapAsync(createBookingRequest));
router.get("/provider/:providerId", wrapAsync(getProviderBookings)); // ✅ Already present
router.get("/:id", wrapAsync(getBookingById));
router.patch("/:id/status", validateSchema(partialBookingSchema), wrapAsync(updateBookingStatus));
router.patch("/:id/soft-delete", wrapAsync(updateBookingIsDeleted)); // ✅ New soft-delete route
router.delete("/:id", wrapAsync(deleteBookingById));

module.exports = router;
