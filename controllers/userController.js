const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { filterObj } = require("../utils/helpers");

module.exports.getAllUsers = catchAsync(async (req, res) => {
  let queryStr = { ...req.query };

  let usersRes = new APIFeatures(User, queryStr).filter().sort().limitFields();

  usersRes = await usersRes.paginate(User);
  users = await usersRes.query;
  res.status(200).json({
    data: users,
    status: "sucess",
    meta: usersRes.meta,
  });
});

module.exports.getUser = catchAsync(async (req, res, next) => {
  const tour = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({ data: user, status: "sucess" });
});
module.exports.createUser = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  // console.log(tour);
  res.status(200).json({ data: user, status: "sucess" });
});
module.exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("No User found with that ID", 404));
  }
  res.status(200).json({ data: user, status: "sucess" });
});
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    res.status(200).json({ data: user, status: "sucess" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
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
