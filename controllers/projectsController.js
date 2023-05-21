const cloudinary = require("cloudinary");
const { v4: uuidv4 } = require("uuid");

const catchAsync = require("../utils/catchAsync");
const Projects = require("../models/projectsModel");
const APIFeatures = require("../utils/apiFeatures");
const Images = require("../models/imgsModel");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//project names
exports.projectNames = catchAsync(async (req, res, next) => {
  req.query.fields = "title";
  req.query.limit = 11111111111;
  next();
});

//Create a new category
exports.createProject = catchAsync(async (req, res, next) => {
  const urls = [];
  // const path = req.file.path;
  await Images.deleteMany({ title: null });

  const uploader = async (file) =>
    await cloudinary.uploader.upload(file.path, { public_id: uuidv4() });
  const result = await uploader(req.file);
  urls.push(result.secure_url);
  // publicIds.push(result.public_id); // add public_id to the array
  //fs.unlinkSync(path);
  const project = await Projects.create({
    category: req.body.category,
    title: req.body.title,
    image: result.secure_url,
    cloudinary_id: result.public_id,
  });

  res.status(201).json({
    message: "Images uploaded successfully",
    data: {
      ...project.toObject(),
      urls: urls,
    },
  });
});

exports.getProjects = catchAsync(async (req, res) => {
  const features = new APIFeatures(Projects.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();

  const projects = await features.query;

  res.status(200).json({
    projects,
    message: "Images retrieved successfully",
  });
});
exports.deleteProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Find the project by ID in MongoDB
  const project = await Projects.findById(id);

  // Find and delete the images associated with the project from MongoDB
  const images = await Images.find({ title: id });
  for (const image of images) {
    await cloudinary.uploader.destroy(image.cloudinary_id);
    await Images.findByIdAndDelete(image._id);
  }

  // Delete the project image from Cloudinary
  await cloudinary.uploader.destroy(project.cloudinary_id);

  // Delete the project from MongoDB
  await Projects.findByIdAndDelete(id);

  res.status(204).json({
    message: "Project and associated images deleted successfully",
  });
});
