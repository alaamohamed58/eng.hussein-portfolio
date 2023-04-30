const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary");
const multer = require("multer");
const Image = require("../models/imgsModel");
cloudinary.config({
  cloud_name: "dk3woypzf",
  api_key: 963183673354336,
  api_secret: "uplPeIDo76nfE3q2jqrlr9DBjho",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
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

exports.addImage = async (req, res, title) => {
  try {
    const uploader = async (path, title) =>
      await cloudinary.uploader.upload(path, { public_id: uuidv4() });

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
    console.log(urls);

    res.status(200).json({
      urls: urls,
      message: "Images uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading images",
    });
  }
};

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
