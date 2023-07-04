const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      throw new AppError("No docment found wit that ID", 404);
    }
    res.status(200).json({ data: null, status: "sucess" });
  });
