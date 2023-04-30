const express = require("express");
const {
  getImages,
  upload,
  addImage,
  deleteImage,
} = require("../controllers/imgsController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, upload.array("image"), addImage).get(getImages);
router.route("/:id").delete(deleteImage);
module.exports = router;
