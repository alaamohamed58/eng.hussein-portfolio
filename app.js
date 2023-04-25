const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const imageRoute = require("./routes/imgsRoute");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.use(morgan("tiny"));

//mounting
app.use("/api/v1/imgs", imageRoute);

//handling uncached routes
app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
