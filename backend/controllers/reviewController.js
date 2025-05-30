const Review = require("../models/review");
const Service = require("../models/service"); // Make sure your path is correct
const ExpressError = require("../utils/ExpressError");

// Create a new review
const createReview = async (req, res, next) => {
  try {
    const { serviceId, userId, rating, comment } = req.body;

    console.log({ serviceId, userId, rating, comment });

    // Validate service existence
    const service = await Service.findById(serviceId);
    if (!service) {
      return next(new ExpressError(404, "Service not found"));
    }

    // Check if the user has already reviewed this service
    const existingReview = await Review.findOne({ serviceId, userId });
    if (existingReview) {
      return next(new ExpressError(400, "You have already reviewed this service"));
    }

    // Create and save the review
    const review = new Review({
      serviceId,
      userId,
      rating,
      comment,
      reactions: {
        helpful: [],
        thanks: [],
        loveThis: [],
        ohNo: [],
      },
    });

    await review.save();

    // Add review ID to the corresponding service
    service.reviews.push(review._id);
    await service.calculateAverageRating(); // Update average rating
    await service.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    next(new ExpressError(500, "Internal Server Error"));
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find()
    .populate("userId", "name email")
    .populate("serviceId", "title");

  res.status(200).json({
    success: true,
    reviews,
  });
};


// controllers/reviewController.js
// const getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find()
//       .populate({
//         path: "userId",
//         select: "name email",
//         populate: {
//           path: "profile",
//           select: "profilePicture"
//         }
//       })
//       .populate("serviceId", "title");
// console.log(reviews, "reviews in getAllReviews");
//     res.status(200).json({
//       success: true,
//       reviews: reviews.map(review => ({
//         ...review._doc,
//         userProfile: review.userId.profile || null
//       }))
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch reviews",
//       error: error.message
//     });
//   }
// };

// Get a review by ID
const getReviewById = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id)
    .populate("userId", "name email")
    .populate("serviceId", "title");

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  res.status(200).json({
    success: true,
    review,
  });
};

// Update a review by ID (for comment or rating changes)
const updateReviewById = async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  const review = await Review.findByIdAndUpdate(
    id,
    { comment, rating },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review,
  });
};

// Delete a review by ID
const deleteReviewById = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  // Remove review ID from the service's reviews array
  await Service.findByIdAndUpdate(review.serviceId, { $pull: { reviews: id } });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};

/// Toggle (add or remove) a reaction to a review
// Add a reaction to a review (only one per user)
const addReactionToReview = async (req, res, next) => {
  try {
    const { id } = req.params; // Review ID
    const { reactionType, userId } = req.body; // User ID and new reaction

    const validReactions = ["helpful", "thanks", "loveThis", "ohNo"];
    if (!validReactions.includes(reactionType)) {
      return next(new ExpressError(400, "Invalid reaction type"));
    }

    const review = await Review.findById(id);
    if (!review) {
      return next(new ExpressError(404, "Review not found"));
    }

    // Remove the user from all reaction arrays first
    validReactions.forEach((type) => {
      review.reactions[type] = review.reactions[type].filter(
        (uid) => uid.toString() !== userId
      );
    });

    // Add the user to the selected reaction array
    review.reactions[reactionType].push(userId);

    await review.save();
 
    res.status(200).json({
      success: true,
      message: `Reaction '${reactionType}' added successfully`,
      review,
    });
  } catch (error) {
    console.error("Error adding reaction to review:", error);
    next(new ExpressError(500, "Internal Server Error"));
  }
};


module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  addReactionToReview,
};








// const Review = require("../models/review");
// // const Service = require("../models/service");
// const Service = require('../models/service'); // If file is "service.js"

// const ExpressError = require("../utils/ExpressError");

// // Create a new review
// const createReview = async (req, res, next) => {
//     try {
//         const { serviceId, userId, rating, comment } = req.body;

//         console.log({ serviceId, userId, rating, comment });

//         // Validate service existence
//         const service = await Service.findById(serviceId);
//         if (!service) {
//             return next(new ExpressError(404, "Service not found"));
//         }
 
//         // Check if the user has already reviewed this service
//         const existingReview = await Review.findOne({ serviceId, userId });
//         if (existingReview) {
//             return next(new ExpressError(400, "You have already reviewed this service"));
//         }

//         // Create and save the review
//         const review = new Review({
//             serviceId: serviceId,
//             userId: userId,
//             rating,
//             comment,
//         });

//         await review.save();

//         // Add review ID to the corresponding service
//         service.reviews.push(review._id);
//         await service.calculateAverageRating(); // Update average rating
//         await service.save();

//         res.status(201).json({
//             success: true,
//             message: "Review created successfully",
//             review,
//         });
//     } catch (error) {
//         console.error("Error creating review:", error);
//         next(new ExpressError(500, "Internal Server Error"));
//     }
// };




// // Get all reviews
// const getAllReviews = async (req, res) => {
//   const reviews = await Review.find()
//     .populate("user", "name email")
//     .populate("service", "title");

//   res.status(200).json({
//     success: true,
//     reviews,
//   });
// };

// // Get a review by ID
// const getReviewById = async (req, res) => {
//   const { id } = req.params;
//   const review = await Review.findById(id)
//     .populate("user", "name email")
//     .populate("service", "title");

//   if (!review) {
//     throw new ExpressError(404, "Review not found");
//   }

//   res.status(200).json({
//     success: true,
//     review,
//   });
// };

// // Update a review by ID
// const updateReviewById = async (req, res) => {
//   const { id } = req.params;
//   const review = await Review.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

//   if (!review) {
//     throw new ExpressError(404, "Review not found");
//   }

//   res.status(200).json({
//     success: true,
//     message: "Review updated successfully",
//     review,
//   });
// };

// // Delete a review by ID
// const deleteReviewById = async (req, res) => {
//   const { id } = req.params;
//   const review = await Review.findByIdAndDelete(id);

//   if (!review) {
//     throw new ExpressError(404, "Review not found");
//   }

//   // Remove review ID from the service's reviews array
//   await Service.findByIdAndUpdate(review.service, { $pull: { reviews: id } });

//   res.status(200).json({
//     success: true,
//     message: "Review deleted successfully",
//   });
// };

// module.exports = {
//   createReview,
//   getAllReviews,
//   getReviewById,
//   updateReviewById,
//   deleteReviewById,
// };



