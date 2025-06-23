// const ServiceProvider = require("../models/serviceProvider");
// const User = require("../models/user");
// const ExpressError = require("../utils/ExpressError");
const Booking = require('../models/booking');
const Review = require('../models/review');

const Service = require('../models/service');
const ServiceProvider = require('../models/serviceProvider');
const ExpressError = require('../utils/ExpressError');

// Create a new service provider
const createServiceProvider = async (req, res, next) => {
  try {
    const { user, phone, address, services, availability } = req.body;

    // Ensure availability is stored as a boolean
    const isAvailable = availability === "true" || availability === true;

    // Check if phone number already exists
    const existingProvider = await ServiceProvider.findOne({ phone });
    if (existingProvider) {
      throw new ExpressError(400, "Phone number already in use");
    }

    const serviceProvider = new ServiceProvider({
      user,
      phone,
      address,
      services,
      availability: isAvailable,
    });

    await serviceProvider.save();

    res.status(201).json({
      success: true,
      message: "Service Provider created successfully",
      serviceProvider,
    });
  } catch (error) {
    next(error);
  }
};

// Get all service providers
const getAllServiceProviders = async (req, res, next) => {
  try {
    const serviceProviders = await ServiceProvider.find().populate("user", "name email");
    res.status(200).json({
      success: true,
      serviceProviders,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single service provider by ID
const getServiceProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Service Provider ID:", id);
    const serviceProvider = await ServiceProvider.findById(id).populate("user", "name email");

    if (!serviceProvider) {
      throw new ExpressError(404, "Service Provider not found");
    }

    res.status(200).json({
      success: true,
      serviceProvider,
    });
  } catch (error) {
    next(error);
  }
};

// Update a service provider by ID
const updateServiceProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { phone, availability } = req.body;

    // Ensure availability is stored as a boolean
    if (availability !== undefined) {
      availability = availability === "true" || availability === true;
    }

    // Check if updating phone number and ensure uniqueness
    if (phone) {
      const existingProvider = await ServiceProvider.findOne({ phone, _id: { $ne: id } });
      if (existingProvider) {
        throw new ExpressError(400, "Phone number already in use");
      }
    }

    const serviceProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      { ...req.body, availability },
      { new: true, runValidators: true }
    );

    if (!serviceProvider) {
      throw new ExpressError(404, "Service Provider not found");
    }

    res.status(200).json({
      success: true,
      message: "Service Provider updated successfully",
      serviceProvider,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a service provider by ID
const deleteServiceProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const serviceProvider = await ServiceProvider.findById(id);

    if (!serviceProvider) {
      throw new ExpressError(404, "Service Provider not found");
    }

    // Delete associated data before removing the provider
    await ServiceProvider.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Service Provider deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}; 




const getServiceProviderDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Get provider basic info
    const serviceProvider = await ServiceProvider.findOne({ user: id })
      .populate("user", "name email phone address");

    if (!serviceProvider) {
      throw new ExpressError(404, "Service Provider not found");
    }

    // 2. Get services
    const services = await Service.find({ provider: serviceProvider.user._id })
      .select('_id price category views averageRating');


     const [bookings, reviews] = await Promise.all([
      Booking.find({ 
        provider: serviceProvider.user._id  // Changed from service: { $in: ... }
      }),
      Review.find({
        serviceId: { $in: services.map(s => s._id) }  // Changed from service to serviceId
      })
    ]);
    console.log("reviews:", reviews);
    // console.log("Bookings:", bookings);

    // 4. Calculate metrics
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalEarningsFromCompleted = completedBookings.reduce((sum, booking) => {
      return sum + (booking.totalPrice || 0);
    }, 0);

    const metrics = {
      totalValue: services.reduce((sum, s) => sum + (s.price || 0), 0),
      totalServices: services.length,
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      totalEarningsFromCompleted, // Added this new metric
      totalReviews: reviews.length,
      totalViews: services.reduce((sum, s) => sum + (s.views || 0), 0),
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
        : 0,
      categories: [...new Set(services.map(s => s.category))]
    };

    res.status(200).json({
      success: true,
      providerDetails: {
        name: serviceProvider.user.name,
        email: serviceProvider.user.email,
        phone: serviceProvider.user.phone,
        address: serviceProvider.user.address,
        availability: serviceProvider.availability ?? false
      },
      analytics: {
        ...metrics,
        categoryCount: metrics.categories.length,
        potentialEarnings: metrics.totalValue * 1.2,
        engagementScore: (
          (metrics.averageRating * 2) + 
          (metrics.totalReviews * 0.5) + 
          (metrics.totalViews * 0.1) +
          (metrics.totalBookings * 0.8)
        ).toFixed(1),
        // Added earnings percentage calculation
        earningsPercentage: metrics.totalValue > 0 
          ? (totalEarningsFromCompleted / metrics.totalValue) * 100 
          : 0
      }
    });

  } catch (error) {
    next(error);
  }
};
module.exports = {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProviderById,
  deleteServiceProviderById,
  getServiceProviderDashboard, // Added this function
};


