const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, 
  bookingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "canceled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// 📌 Middleware: Ensure the service exists before booking
bookingSchema.pre("save", async function (next) {
  const serviceExists = await mongoose.model("Service").exists({ _id: this.service });
  if (!serviceExists) {
    return next(new Error("Service does not exist."));
  }
  next();
});

// 📌 Middleware: Prevent double booking for the same service on the same date
bookingSchema.pre("save", async function (next) {
  const existingBooking = await mongoose.model("Booking").findOne({
    service: this.service,
    user: this.user,
    date: this.date,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingBooking) {
    return next(new Error("You have already booked this service for the selected date."));
  }
  next();
});

// 📌 Method: Cancel Booking
bookingSchema.methods.cancelBooking = async function () {
  this.status = "canceled";
  await this.save();
};

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
