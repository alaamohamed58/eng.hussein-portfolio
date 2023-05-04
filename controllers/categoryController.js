const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary");
const Image = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
exports.addImage = catchAsync(async (req, res, next) => {
  const uploader = async (path, title) =>
    await cloudinary.uploader.upload(path, { public_id: uuidv4() });
  const urls = [];
  const path = req.file.path;
  const result = await uploader(path);
  urls.push(result.secure_url);
  console.log(path);
  // publicIds.push(result.public_id); // add public_id to the array
  fs.unlinkSync(path);
  const image = new Image({
    category: req.body.category,
    image: result.secure_url,
    cloudinary_id: result.public_id,
  });
  await image.save();

  res.status(200).json({
    urls: urls,
    message: "Images uploaded successfully",
  });
});

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ date: -1 }).limit(10);

    res.status(200).json({
      images: images,
      message: "Images retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving images",
    });
  }
};
exports.deleteImage = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting image",
    });
  }
};
