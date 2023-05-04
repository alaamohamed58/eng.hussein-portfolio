const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary");
const multer = require("multer");
const Image = require("../models/imgsModel");
const catchAsync = require("../utils/catchAsync");

//cloudinary configration
cloudinary.config({
  cloud_name: "dk3woypzf",
  api_key: 963183673354336,
  api_secret: "uplPeIDo76nfE3q2jqrlr9DBjho",
});

const storage = multer.diskStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});
// file validation
const fileValidation = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "unsupported file" }, false);
  }
};

exports.upload = multer({
  storage,
  fileFilter: fileValidation,
});
//upload image
exports.addImage = catchAsync(async (req, res, title) => {
  const uploader = async (path, title) =>
    await cloudinary.uploader.upload(path, {
      public_id: uuidv4(),
      folder: "test-directory",
      use_filename: true,
    });

  const urls = [];
  const { files } = req;

  for (const file of files) {
    const { path } = file;
    const result = await uploader(path);
    urls.push(result.secure_url);
    // publicIds.push(result.public_id); // add public_id to the array
    fs.unlinkSync(path);
    const image = new Image({
      title: req.body.title,
      image: result.secure_url,
      cloudinary_id: result.public_id,
    });
    await image.save();
  }

  res.status(200).json({
    urls: urls,
    message: "Images uploaded successfully",
  });
});
//get images
exports.getImages = catchAsync(async (req, res) => {
  const images = await Image.find().sort({ date: -1 }).limit(10);
  const imageCount = await Image.countDocuments();

  res.status(200).json({
    count: imageCount,
    images: images,
    message: "Images retrieved successfully",
  });
});
//delete image
exports.deleteImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  // Find the image by ID in MongoDB
  const image = await Image.findById(id);
  // Delete the image from Cloudinary
  await cloudinary.uploader.destroy(image.cloudinary_id);
  // Delete the image from MongoDB
  await Image.findByIdAndDelete(id);
  res.status(200).json({
    message: "Image deleted successfully",
  });
});
