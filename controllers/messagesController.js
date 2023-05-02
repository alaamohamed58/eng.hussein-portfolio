const message = require("../models/messageModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createMessage = catchAsync(async (req, res, next) => {
  await message.create(req.body);

  res.status(201).json({
    message: "your message has been sent successfully",
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const messages = await message.find();
  res.status(200).json({
    data: {
      messages,
    },
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const message = await message.findByIdAndDelete(params.id);

  if (!message) {
    return next(new AppError("Message not found", 404));
  }
  res.status(204).json({
    message: "successfully deleted",
    data: null,
  });
});
