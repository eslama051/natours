const dotenv = require("dotenv");
const connect = require("./db/connect");
const app = require("./app");
dotenv.config();

const start = async () => {
  try {
    await connect(process.env.DATABASE);
    app.listen(process.env.PORT, () => {
      console.log(`app is running on port :${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
