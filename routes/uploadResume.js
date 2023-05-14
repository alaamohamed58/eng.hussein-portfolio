const fs = require("fs");
const express = require("express");

const { uploadResume, upload, getCV } = require("../controllers/uploadResume");

const router = express.Router();

router.route("/").post(upload.single("file"), uploadResume).get(getCV);

// router.get("/get-cv", (req, res) => {
//   const filePath = fs.readFile(`${__dirname}/uploads`);
//   console.log(filePath);
//   req.status(200).json({
//     file: filePath,
//   });
// });

module.exports = router;
