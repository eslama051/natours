const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const genJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
  return token;
};
exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  const token = genJWT(user._id);
  res.status(201).json({
    data: {
      user: user,
      token,
      status: "success",
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    throw new AppError("Please Provide An Email And Password", 422);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Invalid Email or password", 401);
  }

  const token = genJWT(user._id);

  res.json({
    status: "success",
    token,
  });
});
