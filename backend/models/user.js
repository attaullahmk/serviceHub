


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Service = require("./service");
const Review = require("./review");
const UserProfile = require("./UserProfile");
const Booking = require("./booking");
const Conversation = require("./conversation");
const Message = require("./message");
const Notification = require("./notification");
const ServiceProvider = require("./serviceProvider");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "provider"],
    default: "user",
  },
  resetOTP: {
    type: String,
    default: null,
  },
  resetOTPExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProfile",
  },
});

// 🔐 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔐 OTP Generation for password reset
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOTP = otp;
  this.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// ❌ Cascade delete all related data when a user is deleted
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    // Delete services created by user (as provider)
    await Service.deleteMany({ provider: this._id });

    // Delete reviews written by user
    await Review.deleteMany({ user: this._id });

    // Delete user's profile
    await UserProfile.deleteOne({ user: this._id });

    // Delete bookings made by user
    await Booking.deleteMany({ user: this._id });

    // Optionally: delete bookings for which this user was provider
    const userServices = await Service.find({ provider: this._id });
    const serviceIds = userServices.map((s) => s._id);
    await Booking.deleteMany({ service: { $in: serviceIds } });

    // Delete conversations and messages
    await Conversation.deleteMany({ participants: this._id });
    await Message.deleteMany({ sender: this._id });

    // Delete notifications
    await Notification.deleteMany({ $or: [{ user: this._id }, { sender: this._id }] });

    // Delete serviceProvider profile if exists
    await ServiceProvider.deleteOne({ user: this._id });

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
