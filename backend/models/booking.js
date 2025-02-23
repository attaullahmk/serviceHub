const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links the booking to the user who made it
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", // Links the booking to the service
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider", // Links the booking to the service provider
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"], // Booking status options
    default: "pending",
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0, // Total cost of the booking
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
