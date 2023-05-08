const multer = require("multer");

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "./uploads/");
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// file validation
const fileValidation = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "unsupported file" }, false);
  }
};

const upload = multer({
  storage,
  fileFilter: fileValidation,
});

module.exports = upload;
