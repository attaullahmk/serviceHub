const Booking = require("../models/booking");
const Service = require("../models/service");
const ExpressError = require("../utils/ExpressError");
const { bookingSchema, partialBookingSchema } = require("../schemas/bookingSchema");

// ✅ Create a new booking
const createBooking = async (req, res) => {
  console.log(req.body);
  const { error } = bookingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);

  const { user, service, provider, bookingDate, totalPrice } = req.body;

  // Validate service existence
  const serviceExists = await Service.findById(service);
  if (!serviceExists) throw new ExpressError(404, "Service not found");

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

// ✅ Get all bookings
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("user service provider");

  res.status(200).json({
    success: true,
    data: bookings,
  });
};

// ✅ Get booking by ID
const getBookingById = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).populate("user service provider");

  if (!booking) throw new ExpressError(404, "Booking not found");

  res.status(200).json({
    success: true,
    data: booking,
  });
};

// ✅ Update booking status by ID
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  console.log("id ", id);
  console.log("req.body ", req.body);
  const { error } = partialBookingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);

  const { status } = req.body;
  console.log("status ", status);

  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("user service provider");

  if (!booking) throw new ExpressError(404, "Booking not found");

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: booking,
  });
};

// ✅ Delete booking by ID
const deleteBookingById = async (req, res) => {

  const { id } = req.params;

  const booking = await Booking.findByIdAndDelete(id);

  if (!booking) throw new ExpressError(404, "Booking not found");

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
  });
};


// ✅ Get all bookings for a specific user
const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  console.log("userid ", userId);

  const bookings = await Booking.find({ user: userId }).populate("service provider");

  if (!bookings.length) throw new ExpressError(404, "No bookings found for this user");

  res.status(200).json({
    success: true,
    data: bookings,
  });
};

// ✅ Get all bookings for a specific provider
const getProviderBookings = async (req, res) => {
  const { providerId } = req.params;

  const bookings = await Booking.find({ provider: providerId }).populate("user service");

  if (!bookings.length) throw new ExpressError(404, "No bookings found for this provider");

  res.status(200).json({
    success: true,
    data: bookings,
  });
};

// ✅ Soft delete: Update isDeleted to true by ID
const updateBookingIsDeleted = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).populate("user service provider");

  if (!booking) throw new ExpressError(404, "Booking not found");

  res.status(200).json({
    success: true,
    message: "Booking marked as deleted (isDeleted: true)",
    data: booking,
  });
};




module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBookingById,
  getUserBookings,
  getProviderBookings,
  updateBookingIsDeleted, // ✅ Soft delete option
};
