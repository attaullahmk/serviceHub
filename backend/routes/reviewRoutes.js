const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
} = require("../controllers/reviewController");
const { reviewSchema, partialReviewSchema } = require("../schemas/reviewSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(reviewSchema), wrapAsync(createReview));
router.get("/", wrapAsync(getAllReviews));
router.get("/:id", wrapAsync(getReviewById));
router.put("/:id", validateSchema(partialReviewSchema), wrapAsync(updateReviewById));
router.delete("/:id", wrapAsync(deleteReviewById));

module.exports = router;
