const Review = require("../models/review");
// const Service = require("../models/service");
const Service = require('../models/Service'); // If file is "service.js"

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
            serviceId: serviceId,
            userId: userId,
            rating,
            comment,
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
    .populate("user", "name email")
    .populate("service", "title");

  res.status(200).json({
    success: true,
    reviews,
  });
};

// Get a review by ID
const getReviewById = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id)
    .populate("user", "name email")
    .populate("service", "title");

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  res.status(200).json({
    success: true,
    review,
  });
};

// Update a review by ID
const updateReviewById = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

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
  await Service.findByIdAndUpdate(review.service, { $pull: { reviews: id } });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
