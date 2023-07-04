const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { filterObj } = require("../utils/helpers");
const {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

module.exports.getAllUsers = getAll(User);

module.exports.getUser = getOne(User);
module.exports.createUser = createOne(User);
module.exports.updateUser = updateOne(User);
module.exports.deleteUser = deleteOne(User);

exports.getMe = (req, _, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    throw new AppError(
      "This route is not for passowrd updates, Please user /updaetePassword",
      400
    );
  }
  const filteredObj = filterObj(req.body, "name", "email");
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: updateUser,
    message: "user data updated successfully",
  });
});
exports.deleteMe = catchAsync(async (req, res) => {
  const updateUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: "success",
    data: null,
    message: "Account has been deleted successfully",
  });
});
