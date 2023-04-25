const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: [true, "please select at least one image"],
  },
});

const Images = mongoose.model("Images", imgSchema);

module.exports = Images;
