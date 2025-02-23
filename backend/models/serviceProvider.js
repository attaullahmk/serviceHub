const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema({
  // Reference to the User document that holds credentials and basic info
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  // Additional provider-specific fields
  phone: {
    type: String,
    required: true,
    unique: true, // Phone number must be unique
  },
  address: {
    type: String,
    required: true,
  },
  services: [
    {
      type: String, // List of services offered (e.g., electrician, plumber)
      required: true,
    },
  ],
  availability: {
    type: Boolean, // Changed to boolean (true = available, false = unavailable)
    default: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who reviewed
      comment: { type: String },
      rating: { type: Number },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to delete related data when a provider is deleted
serviceProviderSchema.pre("remove", async function (next) {
  try {
    await mongoose.model("Service").deleteMany({ provider: this._id }); // Delete related services
    await mongoose.model("Review").deleteMany({ provider: this._id }); // Delete related reviews
    next();
  } catch (err) {
    next(err);
  }
});

const ServiceProvider = mongoose.model("ServiceProvider", serviceProviderSchema);

module.exports = ServiceProvider;
