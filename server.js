const dotenv = require("dotenv");
const connect = require("./db/connect");

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED REJECTION!  💥 Shuntting down...");
  console.log(err);
  process.exit(1);
});
const app = require("./app");
dotenv.config();

// const start = async () => {
//   try {
//     await connect(process.env.DATABASE);
//     const server = app.listen(process.env.PORT, () => {
//       console.log(`app is running on port :${process.env.PORT}`);
//     });
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };
// start();
const start = async () => {
  connect(process.env.DATABASE);
  const server = app.listen(process.env.PORT, () => {
    console.log(`app is running on port :${process.env.PORT}`);
  });
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION!  💥 Shuntting down...");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};
start();
