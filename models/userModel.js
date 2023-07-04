const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The user name is required"],
    maxLength: [40, "The user name must not exceed 40 characters "],
    minLength: [5, "The user name must be at least 5 characters long "],
  },
  email: {
    type: String,
    required: [true, "The email is required "],
    validate: {
      validator: validator.isEmail,
      message: "Invalid Email",
    },
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "guide", "lead-guide", "admin"],
      message: "please provide a valid role",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "The password is reqquired "],
    minLength: [8, "Password is too shot!"],
    select: false,
    // validate: {
    //   validator: validator.isStrongPassword,
    //   message: "invalid passowrd",
    // },
  },
  passwordConfirm: {
    type: String,
    required: [true, "The password is not correct"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "invalid passowrd",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtInSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(passwordChangedAtInSeconds, JWTTimestamp);
    return JWTTimestamp < passwordChangedAtInSeconds;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log(resetToken, this.passwordResetToken);
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
