const express = require("express");
const {
  uploadImgs,
  getImages,
  upload,
} = require("../controllers/imgsController");

const router = express.Router();

router.route("/").post(upload.single("photo"), uploadImgs).get(getImages);

module.exports = router;
