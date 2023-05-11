const fs = require("fs");
const express = require("express");

const { uploadResume, upload } = require("../controllers/uploadResume");

const router = express.Router();

router.post("/", upload.single("file"), uploadResume);

router.get("/get-cv", (req, res) => {
  const filePath = fs// Send the CV file as a response
  .req
    .status(200)
    .json({
      file: filePath,
    });
});

module.exports = router;
