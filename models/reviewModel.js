const mongoose = require("mongoose");
const Tour = require("./tourModel");

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
// start :: calc the AverageRatings
reviewSechma.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  });
};
// when creating new review
reviewSechma.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});
//  when updating and deleteing  a review
reviewSechma.pre(/^findOneAnd/, async function (next) {
  const qc = this.toConstructor();
  const cq = new qc();
  this.r = await cq.findOne();

  next();
});
reviewSechma.post(/^findOneAnd/, async function () {
  this.r.constructor.calcAverageRatings(this.r.tour);
});
// End :: calc the AverageRatings

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
