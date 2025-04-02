const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  address: { type: String, required: true, trim: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

  // ✅ Availability check
  availability: { type: Boolean, default: true },

  // ✅ Track views for popularity
  views: { type: Number, default: 0 },

  // ✅ Total review count
  totalReviews: { type: Number, default: 0 },

  // ✅ Engagement Score (combination of views, ratings, and reviews)
  engagementScore: { type: Number, default: 0 },

  // ✅ Average rating (for sorting top-rated services)
  averageRating: { type: Number, default: 0, min: 0, max: 5 },

  // ✅ Image gallery validation
  imageGallery: {
    type: [String],
    default: [],
    validate: {
      validator: function (urls) {
        return urls.every(url =>
          /^(http|https):\/\/[^ "]+\.(jpg|jpeg|png|gif|webp)$/i.test(url)
        );
      },
      message: "Invalid image URL format. Allowed formats: jpg, jpeg, png, gif, webp",
    },
  },

  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// ✅ Indexes for fast queries
serviceSchema.index({ category: 1, availability: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ averageRating: -1 });
serviceSchema.index({ engagementScore: -1 }); // Sort by highest engagement score

// 📌 **Method: Calculate Average Rating & Review Count**
serviceSchema.methods.calculateAverageRating = async function () {
  const service = await this.populate("reviews");

  if (!service.reviews.length) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const total = service.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = (total / service.reviews.length).toFixed(1);
    this.totalReviews = service.reviews.length;
  }

  await this.save();

   // ✅ Also update engagement score when reviews change
   await this.updateEngagementScore();
};

// 📌 **Method: Update Engagement Score**
serviceSchema.methods.updateEngagementScore = async function () {
  // Engagement score = (Avg Rating * 2) + (Total Reviews * 1.5) + (Views * 0.5) + (Newer listings boost)
  const ageFactor = Math.max(1, (new Date() - this.createdAt) / (1000 * 60 * 60 * 24 * 30)); // Age in months
  this.engagementScore = 
    (this.averageRating * 2) +
    (this.totalReviews * 1.5) +
    (this.views * 0.5) +
    (1 / ageFactor); // Newer listings get a slight boost
console.log(this.engagementScore);
  await this.save();
};
 
// 📌 **Middleware: Validate provider existence**
serviceSchema.pre("save", async function (next) {
  if (this.isModified("provider")) {
    const userExists = await mongoose.model("User").exists({ _id: this.provider });
    if (!userExists) {
      return next(new Error("Invalid provider: User does not exist"));
    }
  }
  next();
});

// 📌 **Middleware: Delete associated reviews when service is deleted**
serviceSchema.pre("findOneAndDelete", async function (next) {
  const service = await this.model.findOne(this.getFilter());
  if (service) {
    await mongoose.model("Review").deleteMany({ _id: { $in: service.reviews } });
  }
  next();
});

// 📌 **Middleware: Increase views count**
serviceSchema.methods.incrementViews = async function () {
  console.log("🔹 incrementViews() called for service ID:", this._id);
  this.views += 0.5;
  await this.save();
  
  // ✅ Update engagement score after increasing views
  await this.updateEngagementScore();  
  console.log(`Views: ${this.views}, Engagement Score: ${this.engagementScore}`);
};


const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
// module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);