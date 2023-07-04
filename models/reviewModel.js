const mongoose = require("mongoose");

const reviewSechma = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review field is required"],
      minlength: [10, "The Review is too short"],
      maxlength: [200, "The Review is too long"],
    },
    rating: {
      type: Number,
      max: [5, "The rating field can exceed 5"],
      min: [1, "The rating filed can not be less than 1"],
      required: [true, "the rating field is required"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Tour field is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User field is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSechma.pre(/^find/, function (next) {
  // this.populate([
  //   { path: "user", select: "-__v -passwordChangedAt" },
  //   { path: "tour" },
  // ]);
  this.populate({ path: "user", select: "-__v -passwordChangedAt" });
  next();
});
const Review = mongoose.model("Review", reviewSechma);
module.exports = Review;
