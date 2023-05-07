const express = require("express");
const { dashboard } = require("../controllers/dashboardController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.get("/", protect, dashboard);

module.exports = router;
