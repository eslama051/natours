const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let qureyObj = { ...req.query };
    let apiFeatures = new APIFeatures(Model, qureyObj)
      .filter()
      .sort()
      .limitFields();
    apiFeatures = await apiFeatures.paginate(Model);
    const docs = await apiFeatures.query;
    res.status(200).json({
      data: {
        data: docs,
      },
      status: "sucess",
      meta: apiFeatures.meta,
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      data: {
        data: doc,
      },
      status: "sucess",
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      throw new AppError("No docment found wit that ID", 404);
    }
    res.status(200).json({ data: null, status: "sucess" });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(200).json({ data: doc, status: "sucess" });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No doc found with that ID", 404));
    }
    res.status(200).json({ data: { data: doc }, status: "sucess" });
  });
