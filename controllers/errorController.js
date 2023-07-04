const AppError = require("../utils/appError");

const sendErrorDev = (res, err) => {
  // console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (res, err) => {
  // operational , trusted error : send message to the client
  // console.log(err.isOperational);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // log error
    console.error(err);
    // send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};
const handleCastErrorDB = (err) => {
  message = `Invalid ${err.path} : ${err.value} ID`;
  return new AppError(message, 400);
};
const handleDuplicateKeyDB = (err) => {
  message = `Duplicated  ${Object.keys(err.keyValue)[0]} : ${
    err.keyValue[Object.keys(err.keyValue)[0]]
  } `;
  return new AppError(message, 400);
};
const handleValidationErrorsDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleTokenErrorDB = () => {
  message = `Invalid Token. Please log in again!`;
  return new AppError(message, 401);
};
const handleTokenExpiredErrorDB = () => {
  message = `Your token has expired, plase login again.`;
  return new AppError(message, 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR!";
  if (process.env.NODE_ENV == "development") {
    sendErrorDev(res, err);
  }
  if (process.env.NODE_ENV == "production") {
    if (err.name == "CastError") {
      err = handleCastErrorDB(err);
    }
    // handle duplicated key
    if (err.code == "11000") {
      err = handleDuplicateKeyDB(err);
    }
    if (err.name == "ValidationError") {
      err = handleValidationErrorsDB(err);
    }
    if (err.name == "JsonWebTokenError") {
      err = handleTokenErrorDB();
    }
    if (err.name == "TokenExpiredError") {
      err = handleTokenExpiredErrorDB();
    }
    sendErrorProd(res, err);
  }
};
