const fs = require("fs");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const Images = require("../models/imgsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/projects");
  },
  filename: (req, file, cb) => {
    // project-5454-444.jpg
    const imgExtension = file.mimetype.split("/")[1];
    cb(null, `project-${Date.now()}.${imgExtension}`);
  },
});

const multerFile = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not image! please select an image", 400), false);
  }
};

exports.upload = multer({
  storage: multerStorage,
  limits: { files: 10 },
}).array("photo");

exports.uploadImgs = catchAsync(async (req, res, next) => {
  console.log(req.files);
  console.log(req.body);
  const images = await Images.create({
    photo: req.file.filename,
  });

  res.status(201).json({
    message: "successfully uploaded",
    data: {
      images,
    },
  });
  4;
});

exports.getImages = catchAsync(async (req, res, next) => {
  const imagePath = "public/img/projects";
  fs.readdir(imagePath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving images");
    } else {
      const images = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );
      res.json(images);
    }
  });
});
