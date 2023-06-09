const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

let db;
if (process.env.NODE_ENV === "development") {
  db = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
} else if (process.env.NODE_ENV === "production") {
  db = process.env.MONGO_URL;
}

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection succesfuly"))
  .catch((err) => console.log(err));

//port
let port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
  console.log(`NODE ${process.env.NODE_ENV}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
