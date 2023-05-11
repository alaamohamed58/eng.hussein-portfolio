const multer = require("multer");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, "cv.pdf"); // Specify a fixed filename for the CV file
  },
});

exports.upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF or Word documents are allowed.")
      );
    }
  },
});

exports.uploadResume = catchAsync(async (req, res) => {
  // Delete the old file if it exists

  // Access the uploaded file using req.file
  const uploadedFile = req.file;

  // Process the file as per your requirements
  // For example, you can obtain the file name, size, and path:
  const fileName = uploadedFile.originalname;
  const fileSize = uploadedFile.size;
  const filePath = uploadedFile.path;

  // You can now perform additional operations with the file, such as saving it to a database or cloud storage,
  // or manipulating its content.

  // Send a success response
  res.status(201).json({
    message: "Uploaded file successfully",
    uploadedFile,
  });
});
