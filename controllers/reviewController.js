const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const { deleteOne } = require("./handlerFactory");

module.exports.getAllReviews = catchAsync(async (req, res) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;
  let qureyObj = { ...req.query };
  let apiFeatures = new APIFeatures(Review, qureyObj)
    .filter()
    .sort()
    .limitFields();

  apiFeatures = await apiFeatures.paginate();
  const reviews = await apiFeatures.query;

  res.status(200).json({
    data: reviews,
    status: "sucess",
    meta: apiFeatures.meta,
  });
});

module.exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }
  res.status(200).json({ data: review, status: "sucess" });
});

module.exports.createReview = catchAsync(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(200).json({ data: newReview, status: "sucess" });
});

module.exports.deleteReview = deleteOne(Review);

// module.exports.deleteReview = async (req, res) => {
//   const review = await Review.findByIdAndRemove(req.params.id);
//   res.status(200).json({
//     status: "sucess",
//     message: "That review has been deleted successfuly",
//   });
// };
