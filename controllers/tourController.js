// const formidable = require("formidable");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

module.exports.getAllTours = catchAsync(async (req, res) => {
  let qureyObj = { ...req.query };
  let apiFeatures = new APIFeatures(Tour, qureyObj)
    .filter()
    .sort()
    .limitFields();
  apiFeatures = await apiFeatures.paginate(Tour);
  const tours = await apiFeatures.query;
  res.status(200).json({
    data: tours,
    status: "sucess",
    meta: apiFeatures.meta,
  });
});
module.exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({ data: tour, status: "sucess" });
});
module.exports.createTour = catchAsync(async (req, res) => {
  const tour = await Tour.create(req.body);
  console.log(tour);
  res.status(200).json({ data: tour, status: "sucess" });
});
module.exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({ data: tour, status: "sucess" });
});

//old way just to remeber

// module.exports.updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({ data: tour, status: "sucess" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// };
module.exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndRemove(req.params.id);
    res.status(200).json({ data: tour, status: "sucess" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
