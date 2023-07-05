const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./.env" });
const Tour = require("./models/tourModel");
const User = require("./models/userModel");
const Review = require("./models/reviewModel");
const fs = require("fs");

mongoose
  .connect(process.env.DATABASE)
  .then(async () => {
    console.log("DB is connected...");
    // app.listen(process.env.PORT, () => {
    //   console.log(`app is running on port :${process.env.PORT}`);
    // });
    if (process.argv[2] == "--import") {
      await importData();
    } else if (process.argv[2] == "--delete") {
      await deleteData();
    }
    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });

const importData = async () => {
  try {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, "utf-8")
    );
    const users = JSON.parse(
      fs.readFileSync(`${__dirname}/dev-data/data/users.json`, "utf-8")
    );
    const reviews = JSON.parse(
      fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, "utf-8")
    );
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
