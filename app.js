const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const imageRoute = require("./routes/categoryRoute");
const projectRoute = require("./routes/projectRoute");
const messageRoute = require("./routes/messageRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const userRoute = require("./routes/userRoute");
const imgsRoute = require("./routes/imgsRoute");
const resumeRoute = require("./routes/uploadResume");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://eng-hussein-portfolio.vercel.app",
      "https://hussein-portfolio.web.app",
    ],
  })
);

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.use(morgan("tiny"));

//mounting
app.use("/api/v1/category", imageRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/images", imgsRoute);
app.use("/api/v1/resume", resumeRoute);

//handling uncached routes
app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
