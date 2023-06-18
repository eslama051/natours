const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name tour is required"],
      trim: true,
      unique: true,
      minLength: [5, "The Name cant be less than 5 characters long "],
      maxLength: [40, "The Name cant be more than 5 characters long"],
    },
    slug: String,
    difficulty: {
      type: String,
      required: [true, "The tour difficulty is required"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty value is not valid",
      },
    },
    duration: {
      type: Number,
      required: [true, "the tour duration in required "],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "The Max group size is required "],
    },
    price: {
      type: Number,
      required: [true, "The tour price is required "],
    },
    discountPrice: {
      type: Number,
      // required: [true, "The tour price is required "],
      default: 0,
      validate: {
        validator: function (val) {
          // console.log(this._update.$set.price);
          if (this._update) {
            return val < this._update.$set.price;
          } else {
            return val < this.price;
          }
        },
        message: "dicount price ({VALUE}) must be less than the price ",
      },
    },
    description: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "the summary is required"],
    },
    images: [String],
    imageCover: {
      type: String,
      required: [true, "The cover image tour is required"],
    },
    ratingsAverage: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.pre("save", function (next) {
  // console.log(doc);
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre("find", function (next) {
//   this.find({ difficulty: { $ne: "easy" } });
//   next();
// });
tourSchema.virtual("durationWeek").get(function () {
  return this.duration / 7;
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
