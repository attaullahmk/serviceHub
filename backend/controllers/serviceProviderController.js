// const ServiceProvider = require("../models/serviceProvider");
// const User = require("../models/user");
// const ExpressError = require("../utils/ExpressError");
// const Service = require('../models/service');
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

// Get service provider dashboard details by user ID
// const getServiceProviderDashboard = async (req, res, next) => {
//   try {
//     const { id } = req.params; // User ID
//     console.log("User ID:", id);

//     // Find the service provider using the user ID
//     const serviceProvider = await ServiceProvider.findOne({ user: id })
//       .populate("user", "name email")
//       .populate("services"); // Fetch associated services

//     if (!serviceProvider) {
//       throw new ExpressError(404, "Service Provider not found");
//     }

//     console.log(serviceProvider.services)
//     res.status(200).json({
//       success: true,
//       message: "Service Provider dashboard fetched successfully",
//       dashboard: {
//         providerDetails: {
//           name: serviceProvider.user.name,
//           email: serviceProvider.user.email,
//           phone: serviceProvider.phone,
//           address: serviceProvider.address,
//           availability: serviceProvider.availability,
//         },
//         services: Services, // List of services
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Get service provider dashboard details by user ID
const getServiceProviderDashboard = async (req, res, next) => {
  try {
    const { id } = req.params; // User ID
    console.log("User ID:", id);

    // Find the service provider using the user ID and populate user details
    const serviceProvider = await ServiceProvider.findOne({ user: id })
      .populate("user", "name email");

      console.log(serviceProvider)

    if (!serviceProvider) {
      throw new ExpressError(404, "Service Provider not found");
    }

    res.status(200).json({
      success: true,
      message: "Service Provider details fetched successfully",
      providerDetails: {
        name: serviceProvider.user.name,
        email: serviceProvider.user.email,
        phone: serviceProvider.phone,
        address: serviceProvider.address,
        // availability: serviceProvider.availability,
        availability: serviceProvider.availability ?? false, // Fallback if missing

      },
      
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


