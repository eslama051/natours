// const formidable = require("formidable");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
  createOne,
} = require("./handlerFactory");

module.exports.getAllTours = getAll(Tour);
module.exports.getTour = getOne(Tour, "reviews");
module.exports.createTour = createOne(Tour);
module.exports.updateTour = updateOne(Tour);

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

// module.exports.deleteTour = catchAsync(async (req, res) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     throw new AppError("No docment found wit that ID", 404);
//   }
//   res.status(200).json({ data: null, status: "sucess" });
// });

module.exports.deleteTour = deleteOne(Tour);
