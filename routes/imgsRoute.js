const express = require("express");
const { protect } = require("../controllers/authController");
const { addImage, getImages } = require("../controllers/imgsController");
const upload = require("../utils/multer");

const router = express.Router();

router
  .route("/")
  .post(protect, upload.array("images"), addImage)
  .get(getImages);

module.exports = router;
