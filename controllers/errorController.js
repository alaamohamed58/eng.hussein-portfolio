const AppError = require("../utils/appError");

const handleJsonWebTokenErrorDB = () =>
  new AppError("invalid token. please login", 401);
const handleJsonWebTokenExpire = () => new AppError("token expired", 403);
const handleDublicateErrorDB = (err) => {
  const message = `Duplicate field value entered: ${
    err.keyValue.email || err.keyValue.name
  }`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  let message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  let message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  console.log(err.statusCode, "1");
  console.log(err.status, "2");
  console.log("END");
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};
module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    console.log(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateErrorDB(error);
    // if (error.errors.name === "ValidatorError") {
    //   error = handleValidationErrorDB(error);
    // }
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenErrorDB();
    if (error.name === "TokenExpiredError") error = handleJsonWebTokenExpire();

    sendErrorProd(error, res);
  }
};
