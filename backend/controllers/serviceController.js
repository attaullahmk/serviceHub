// const Service = require("../models/service");
// const ExpressError = require("../utils/ExpressError");

// Create a new service
const Service = require("../models/service");

const ExpressError = require("../utils/ExpressError");

// Create a new service 
const createService = async (req, res) => {
  try {
    const { title, description, category, price, availability, provider, address } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const imageGallery = req.files.map(file => file.path);
//  console.log( { title, description, category, price, availability, provider, address });
    const service = new Service({
      title,
      description,
      category,
      price,
      availability,
      provider,
      address, // Added address attribute here
      imageGallery,
    });
//  console.log(service);
    await service.save();

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all services
const getAllServices = async (req, res) => {
  const services = await Service.find().populate("provider", "name email");

  res.status(200).json({
    success: true,
    services,
  });
};

// Get a single service by ID
// const getServiceById = async (req, res) => {

//   const { id } = req.params;
//   // console.log(id);
//   const service = await Service.findById(id).populate("provider", "name email");

//   if (!service) {
//     throw new ExpressError(404, "Service not found");
//   }

//   res.status(200).json({
//     success: true,
//     service,
//   });
// };

const getServiceById = async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id)
    .populate("provider", "name email")
    .populate({
      path: "reviews", // Populating the reviews field
      populate: {
        path: "userId", // If reviews have a reference to the user who wrote them
        select: "name email",
      },
    });

    if (!service || service.isDeleted) {
      return res.status(404).json({ message: "Service not found" });
    }

        // Increment views count if `incrementViews` method exists in the model
        if (typeof service.incrementViews === "function") {
          await service.incrementViews();
        } 

  res.status(200).json({
    success: true,
    service,
  });
};


// Update a service by ID
const updateServiceById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const updates = req.body;

  // Check if new images are uploaded
  if (req.files && req.files.length > 0) {
    updates.imageGallery = req.files.map(file => file.path);
  }

  const updatedService = await Service.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedService) {
    throw new ExpressError(404, "Service not found");
  }

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    updatedService,
  });
};

// Delete a service by ID
const deleteServiceById = async (req, res) => {
  const { id } = req.params;

  const deletedService = await Service.findByIdAndDelete(id);

  if (!deletedService) {
    throw new ExpressError(404, "Service not found");
  }

  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
    deletedService,
  });
};


//search 
// const searchServices = async (req, res) => {
//   try {
//     const { category, title, address } = req.query;
//  console.log( {category, title, address })
//     if (!category && !title && !address) {
//       return res.status(400).json({ message: "Please provide at least one search parameter." });
//     }

//     // Build a dynamic query object
//     const query = {};
//     if (category) {
//       query.category = { $regex: new RegExp(category, "i") }; // Case-insensitive search
//     }
//     if (title) {
//       query.title = { $regex: new RegExp(title, "i") };
//     }
//     if (address) {
//       query.address = { $regex: new RegExp(address, "i") };
//     }

//     const services = await Service.find(query).populate("provider", "name email");

//     if (services.length === 0) {
//       return res.status(404).json({ message: "No services found matching the criteria." });
//     }

//     res.status(200).json({
//       success: true,
//       services,
//     });
//   } catch (error) {
//     console.error("Error searching services:", error);
//     res.status(500).json({ message: "Internal server error" });
//   } 
// };
const searchServices = async (req, res) => {
  try {
    const { category, title, address, sortByPrice, sortByRating, availability, priceRange } = req.query;

    console.log("Received Query:", { category, title, address, sortByPrice, sortByRating, availability, priceRange });

    const query = {};
    if (category) query.category = { $regex: new RegExp(category, "i") };
    if (title) query.title = { $regex: new RegExp(title, "i") };
    if (address) query.address = { $regex: new RegExp(address, "i") };

    // Filter for availability
    if (availability === "true") {
      query.availability = true;
    } else if (availability === "false") {
      query.availability = false;
    }

    if (priceRange === "low") query.price = { $lt: 50 };
    else if (priceRange === "medium") query.price = { $gte: 50, $lte: 200 };
    else if (priceRange === "high") query.price = { $gt: 200 };

    // Sorting Logic
    let sortOptions = {};
    if (sortByPrice === "price_asc") {
      sortOptions.price = 1;
    } else if (sortByPrice === "price_desc") {
      sortOptions.price = -1;
    }

    if (sortByRating === "rating_desc") {
      sortOptions.averageRating = 1;
    } else if (sortByRating === "rating_asc") {
      sortOptions.averageRating = -1;
    }

    // console.log("Sorting Options:", sortOptions);

    const services = await Service.find(query)
      .populate("provider", "name email")
      .sort(sortOptions);

    // console.log("Filtered Services:", services.map(s => ({ title: s.title, availability: s.availability })));

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Error searching services:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// module.exports = { searchServices };



// Get services by provider ID
const getServicesByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    const services = await Service.find({ provider: providerId }).populate("provider", "name email");
    
    if (!services || services.length === 0) {
      return res.status(404).json({ success: false, message: "No services found for this provider" });
    }
// console.log("serives", services);    
    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Error fetching services by provider ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};












// Get top-rated services
// const getTopRatedServices = async (req, res) => {
//   try {
//     const topRatedServices = await Service.find({ isDeleted: false }) // Exclude deleted services
//       .sort({ averageRating: -1 }) // Sort by highest average rating
//       .limit(10) // Get top 10 highest-rated services
//       .populate("provider", "name email");

//     res.status(200).json({
//       success: true,
//       services: topRatedServices,
//     });
//   } catch (error) {
//     console.error("Error fetching top-rated services:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

const getTopRatedServices = async (req, res) => {
  try {
    const topRatedServices = await Service.find({ availability: true, isDeleted: false })
      .sort({ engagementScore: -1, averageRating: -1, totalReviews: -1 }) // Sort based on highest engagement
      .limit(10)
      .populate("provider", "name email");

      res.status(200).json({
        success: true,
        services: topRatedServices,
      });
    } catch (error) {
      console.error("Error fetching top-rated services:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };





// Get the latest 10 created services
const getLatestServices = async (req, res) => {
  try {
    const latestServices = await Service.find({ isDeleted: false }) // Exclude deleted services
      .sort({ updatedAt: -1 }) // Sort by newest first
      .limit(10) // Get only 10 latest services
      .populate("provider", "name email");

    if (!latestServices || latestServices.length === 0) {
      return res.status(404).json({ success: false, message: "No services found" });
    }

    res.status(200).json({
      success: true,
      services: latestServices,
    });
  } catch (error) {
    console.error("Error fetching latest services:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  searchServices,
  getServicesByProviderId,
  getTopRatedServices, // Added new route
  getLatestServices, // Added new route
};




// module.exports = {
//   createService,
//   getAllServices,
//   getServiceById,
//   updateServiceById,
//   deleteServiceById,
//   searchServices,

//   // searchServicesByCategory,
//   // searchServicesByAddressOrTitle, // New function added
// };

