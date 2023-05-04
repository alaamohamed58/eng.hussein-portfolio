const fs = require("fs");

const cloudinary = require("cloudinary");
const { v4: uuidv4 } = require("uuid");

const catchAsync = require("../utils/catchAsync");
const Projects = require("../models/projectsModel");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
//Create a new category

exports.createProject = catchAsync(async (req, res, next) => {
  const uploader = async (path, title) =>
    await cloudinary.uploader.upload(path, { public_id: uuidv4() });
  const urls = [];
  const path = req.file.path;
  const result = await uploader(path);
  urls.push(result.secure_url);
  console.log(path);
  // publicIds.push(result.public_id); // add public_id to the array
  fs.unlinkSync(path);
  const project = new Projects({
    category: req.body.category,
    title: req.body.title,
    image: result.secure_url,
    cloudinary_id: result.public_id,
  });
  await project.save();

  res.status(200).json({
    urls: urls,
    message: "Images uploaded successfully",
  });
});

exports.getProjects = catchAsync(async (req, res) => {
  const projects = await Projects.find().sort({ date: -1 }).limit(10);

  res.status(200).json({
    projects,
    message: "Images retrieved successfully",
  });
});
