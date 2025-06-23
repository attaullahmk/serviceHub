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


  console.log(status, "status in updateBookingStatus");
  if (status === "completed") {
    await Service.findByIdAndUpdate(booking.service, {
      $inc: { bookingCount: 1 },
    });
  }


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



const Notification = require("../models/notification");


const createBookingRequest = async (req, res) => {
  try {
    console.log(req.body);
    const { category, area, offeredPrice, description, id } = req.body;
 console.log(req.body, "req.body in createBookingRequest");
    const userId = id || req.user._id;

    if (!category || !area || !offeredPrice || !userId) {
      return res.status(400).json({ error: "Category, Area, Offered Price, and User ID are required." });
    }

    // 1. Find all services matching the category and area
    const matchingServices = await Service.find({
      category: category,
      address: { $regex: new RegExp(area, "i") }, 
      availability: true,
      isDeleted: false,
    }).populate("provider");
    console.log("Matching Services: ", matchingServices); // Debugging line
    if (matchingServices.length === 0) {
      return res.status(404).json({ message: "No services found in this area and category." });
    }

    // 2. Create a booking for each matching service
    const createdBookings = [];

    for (const service of matchingServices) {
      const bookingData = {
        user: userId,
        service: service._id,
        provider: service.provider._id,
        bookingDate: new Date(), // 🧠 Setting booking date to now, or you can customize
        totalPrice: offeredPrice, // 🧠 Using offered price
      };

 

      const booking = new Booking(bookingData);
      await booking.save();
      createdBookings.push(booking);
    }

    // 3. Send notification to each provider
    const notifications = matchingServices.map(service => ({
      recipient: service.provider._id,
      sender: userId,
      type: "booking",
      message: `New booking request! Offered price: PKR ${offeredPrice}. Description: ${description || "No details"}`,
    }));

    await Notification.insertMany(notifications);

    // 4. Send response back to the customer
    res.status(201).json({
      message: "Booking request sent and bookings created successfully!",
      servicesNotified: matchingServices.length,
      bookingsCreated: createdBookings.length,
    });

  } catch (error) {
    console.error("Error creating booking request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
  createBookingRequest
};
