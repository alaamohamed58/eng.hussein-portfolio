const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: [true, "please select at least one image"],
  },
  title: {
    type: String,
    required: [true, "image title is required "],
  },
});

const Images = mongoose.model("Images", imgSchema);

module.exports = Images;
