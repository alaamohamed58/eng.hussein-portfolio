const path = require("path");
const multer = require("multer");
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

  if (!uploadedFile) {
    // Handle the case when no file was uploaded
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Process the file as per your requirements
  // For example, you can obtain the file name, size, and path:
  const fileName = uploadedFile.originalname;
  const fileSize = uploadedFile.size;
  const filePath = uploadedFile.path;

  // Perform additional operations with the file, such as saving it to a database or cloud storage,
  // or manipulating its content.

  // Send a success response
  res.status(201).json({
    message: "Uploaded file successfully",
    uploadedFile,
  });
});

exports.getCV = (req, res) => {
  // Specify the path to the CV file
  const filePath = path.join(__dirname, "../uploads/cv.pdf");

  // Send the file as the response
  res.sendFile(filePath);
};
