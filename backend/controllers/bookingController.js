const Booking = require("../models/booking");
const ExpressError = require("../utils/ExpressError");

// Create a new booking
const createBooking = async (req, res) => {
  const { user, service, provider, bookingDate, totalPrice } = req.body;

  const booking = new Booking({
    user,
    service,
    provider,
    bookingDate,
    totalPrice,
  });

  await booking.save();

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
};

// Get all bookings
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("user service provider");

  res.status(200).json({
    success: true,
    data: bookings,
  });
};

// Get booking by ID
const getBookingById = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).populate("user service provider");

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
};

// Update booking status by ID
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("user service provider");

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: booking,
  });
};

// Delete booking by ID
const deleteBookingById = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findByIdAndDelete(id);

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
  });
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBookingById,
};
