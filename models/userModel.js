const mongoose = require("mongoose");
const validator = require("validator");

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
  },
  password: {
    type: String,
    required: [true, "The password is reqquired "],
    validate: {
      validator: validator.isStrongPassword,
      message: "invalid passowrd",
    },
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
