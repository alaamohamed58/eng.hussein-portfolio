const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, "please select image"],
  },
  cloudinary_id: {
    type: String,
  },
});

const Category = mongoose.model("Category", imageSchema);

module.exports = Category;
