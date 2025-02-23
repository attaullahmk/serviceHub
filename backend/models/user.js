const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Service = require("./service"); // Import Service model
const Review = require("./review"); // Import Review model

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
      return !this.googleId; // Password is required only if not using Google OAuth
    },
  },
  googleId: {
    type: String, // Used to store Google OAuth ID
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "provider", "admin"], // Define roles
    default: "user",
  },
  resetOTP: {
    type: String, // OTP for password reset
    default: null,
  },
  resetOTPExpires: {
    type: Date, // Expiry time for OTP
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // No password means OAuth user
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate and store OTP for password reset
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.resetOTP = otp;
  this.resetOTPExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  return otp;
};


// Delete all services and reviews when a user is deleted
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    await Service.deleteMany({ provider: this._id }); // Delete all services by user
    await Review.deleteMany({ user: this._id }); // Delete all reviews by user
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
