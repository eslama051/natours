const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const errorController = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.get("/", (req, res) => {
  res.end("test");
});
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = "fail";

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);
module.exports = app;
