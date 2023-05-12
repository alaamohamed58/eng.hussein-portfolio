const mongoose = require("mongoose");
const slugify = require("slugify");
const Images = require("./imgsModel");

const projectsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "project title is required"],
    trim: true,
  },
  category: {
    type: String,
    enum: ["retail", "residential", "health_care"],
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

projectsSchema.pre("findOneAndDelete", async function (next) {
  const a = await Images.find({
    images:
      "https://res.cloudinary.com/dk3woypzf/image/upload/v1683877504/ta7twapsddggabmo5fat.jpg",
  });
  console.log(a);
  next();
});

const Projects = mongoose.model("Project", projectsSchema);

module.exports = Projects;
