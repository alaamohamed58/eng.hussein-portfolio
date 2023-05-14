const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const path = require("path");

const storage = multer.diskStorage({
  // Specify the destination folder
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Define the allowed file types
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    // Add more allowed file types if needed
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept the file if its MIME type is in the allowed list
    cb(null, true);
  } else {
    // Reject the file if its MIME type is not allowed
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, and GIF images are allowed."
      )
    );
  }
};

exports.upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Add the MIME type for DOCX files
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, Word documents, and DOCX files are allowed."
        )
      );
    }
  },
});

exports.uploadImages = catchAsync(async (req, res) => {
  // Access the uploaded images using req.files
  const uploadedImages = req.files;

  if (!uploadedImages || uploadedImages.length === 0) {
    // Handle the case when no images were uploaded
    return res.status(400).json({ error: "No images uploaded" });
  }

  // Process the uploaded images as needed
  // ...

  // Send a success response
  res.status(201).json({
    message: "Uploaded images successfully",
    uploadedImages,
  });
});
exports.getCV = (req, res) => {
  // Specify the path to the CV file
  const filePath = path.join(__dirname, "../uploads/cv.pdf");

  // Send the file as the response
  res.sendFile(filePath);
};
