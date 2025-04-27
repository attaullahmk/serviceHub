const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reactions: {
    helpful: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    thanks: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    loveThis: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    ohNo: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Add a unique compound index
reviewSchema.index({ serviceId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;



// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//   serviceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Service",
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   comment: {
//     type: String,
//     maxlength: 500,
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5,
//   },
//   reactions: {
//     helpful: { type: Number, default: 0 },
//     thanks: { type: Number, default: 0 },
//     loveThis: { type: Number, default: 0 },
//     ohNo: { type: Number, default: 0 },
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, {
//   timestamps: true
// });

// // Add a unique compound index
// reviewSchema.index({ serviceId: 1, userId: 1 }, { unique: true });

// const Review = mongoose.model("Review", reviewSchema);
// module.exports = Review;


