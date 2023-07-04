const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const genJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
  return token;
};

const createSendToken = (user, statusCode, res, message = "") => {
  const token = genJWT(user._id);

  const cookieOptions = {
    expires:
      Date.now() * process.env.JWT_cookie_EXPIRE_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
    message,
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  createSendToken(user, 200, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //getting  Token and checking if its exist or not
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError("You are not logged in! Please log in to get access");
  }
  // verification token
  const promisifiedJwtVerify = promisify(jwt.verify);
  const decoded = await promisifiedJwtVerify(token, process.env.JWT_SECRET);

  // check if the user still exits

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    throw new AppError(
      "The user belonging to this token does no longer exsit",
      401
    );
  }

  // check if user changed password after the token was created

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    throw new AppError(
      "this user recenlty changed password! Please log in again.",
      401
    );
  }
  req.user = freshUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("Please Inset Your Email!", 422);
  }
  // getting the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("There is no user with that email address ", 404);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send the reset token to the user
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new passowrd and possword confirm to: ${resetUrl}.\nIF you didn't forget your password, please ignore this email!`;

  // console.log(message);
  await sendEmail({
    email: user.email,
    subject: "your password reset token (valid for 10 min )",
    message,
  });
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});
exports.resetPassword = catchAsync(async (req, res) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });

  //  check if the token has not expired , and there is a user , set the new password

  if (!user) {
    throw new AppError("Token is invalid or has Expired!", 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;

  await user.save();

  // update password change at propert  for the user
  // log the user in , send jwt
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res) => {
  // console.log(
  //   await req.user.correctPassword(req.body.current_password, req.user.password)
  // );

  // 1) Get user from collection
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.correctPassword(req.body.current_password, user.password))) {
    throw new AppError("Current is not correct! please try again ", 400);
  }

  user.password = req.body.new_password;
  user.passwordConfirm = req.body.password_confirm;
  await user.save();

  createSendToken(user, 200, res, "password has been updated successfully");
});
