const express = require("express");
const {
  createProject,
  getProjects,
  projectNames,
} = require("../controllers/projectsController");
const { protect } = require("../controllers/authController");
const upload = require("../utils/multer");

const router = express.Router();

router.route("/project-name").get(projectNames, getProjects);

router
  .route("/")
  .post(protect, upload.single("image"), createProject)
  .get(getProjects);

module.exports = router;

/*

1 - create category [
  {
    "category" : "health care",
    "image" : "health care",
   
  }
]






*/
