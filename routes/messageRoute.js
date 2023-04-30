const express = require("express");
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messagesController");

const router = express.Router();

router.route("/").post(createMessage).get(getMessages);
router.route("/:id").delete(deleteMessage);

module.exports = router;
