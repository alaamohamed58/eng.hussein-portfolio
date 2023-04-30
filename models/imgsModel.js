const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
  },
});

module.exports = mongoose.model("Image", imageSchema);
