const express = require("express");
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messagesController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, createMessage).get(protect, getMessages);
router.route("/:id").delete(deleteMessage);

module.exports = router;
