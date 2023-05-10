const mongoose = require("mongoose");

const ImgsSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: [true, "Image title is required"],
  },
  images: {
    type: String,
    required: [true, "please select image"],
  },
  cloudinary_id: String,
});

ImgsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "title",
    select: "title",
  });
  next();
});

const Images = mongoose.model("Image", ImgsSchema);

module.exports = Images;
