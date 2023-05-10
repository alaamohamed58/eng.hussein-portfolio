const express = require("express");
const {
  getImages,
  addImage,
  deleteImage,
} = require("../controllers/categoryController");
const upload = require("../utils/multer");

const { protect } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("image"), addImage)
  .get(getImages);
router.route("/:id").delete(deleteImage);

module.exports = router;

/*

// POST Category /api/v1/category     {category : "residential", image : ""} // single image

// POST Images inside a category   /api/v1/projects/categoryID     {images : "", title : "", category : "", slug: ""} //single image
















*/
