const Message = require("../models/messageModel");
const Projects = require("../models/projectsModel");
const catchAsync = require("../utils/catchAsync");

exports.dashboard = catchAsync(async (req, res, next) => {
  const messagesCount = await Message.countDocuments();
  const projectsCount = await Projects.countDocuments();

  res.status(200).json({
    data: {
      messagesCount,
      projectsCount,
    },
  });
});
