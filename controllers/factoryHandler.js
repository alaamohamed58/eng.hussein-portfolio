const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary");

exports.deleteOne = (Projects, Images) =>
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //delete images with the same title
    await Images.deleteMany({ title: id });

    // Find the image by ID in MongoDB
    const doc = await Projects.findById(id);
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(doc.cloudinary_id);
    // Delete the image from MongoDB
    await Projects.findByIdAndDelete(id);
    res.status(204).json({
      message: "Image deleted successfully",
    });
  });
