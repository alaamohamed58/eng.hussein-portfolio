const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary");
const Images = require("../models/imgsModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

//cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//upload image
exports.addImage = catchAsync(async (req, res) => {
  const uploader = async (file) =>
    await cloudinary.uploader.upload(file.path, { public_id: uuidv4() });

  const urls = [];
  const { files } = req;

  for (const file of files) {
    const result = await uploader(file);
    urls.push(result.secure_url);
    // publicIds.push(result.public_id); // add public_id to the array
    await Images.create({
      title: req.body.title,
      images: result.secure_url,
      cloudinary_id: result.public_id,
    });
  }

  res.status(200).json({
    urls: urls,
    message: "Images uploaded successfully",
  });
});
//get images
exports.getImages = catchAsync(async (req, res) => {
  const features = new APIFeatures(Images.find(), req.query).filter();

  const images = await features.query;
  const imageCount = await Images.countDocuments();

  res.status(200).json({
    count: imageCount,
    images,
    message: "Images retrieved successfully",
  });
});
//delete image
exports.deleteImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  // Find the image by ID in MongoDB
  const image = await Images.findById(id);
  // Delete the image from Cloudinary
  await cloudinary.uploader.destroy(image.cloudinary_id);
  // Delete the image from MongoDB
  await Images.findByIdAndDelete(id);
  res.status(200).json({
    message: "Image deleted successfully",
  });
});
