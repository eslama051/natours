const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./.env" });
const Tour = require("./models/tourModel");
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
    let data = fs.readFileSync(
      `${__dirname}/dev-data/data/tours.json`,
      "utf-8"
    );
    data = JSON.parse(data);
    await Tour.create(data);
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
