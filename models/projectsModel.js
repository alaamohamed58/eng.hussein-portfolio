const mongoose = require("mongoose");
const slugify = require("slugify");

const projectsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "project title is required"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "project category is required"],
  },
  image: {
    type: String,
    required: [true, "please select image"],
  },
  slug: String,
  cloudinary_id: String,
});

projectsSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

const Projects = mongoose.model("Project", projectsSchema);

module.exports = Projects;
