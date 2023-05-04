const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide your name"],
  },
  phone: Number,
  message: {
    type: String,
    required: [true, "please provide your message"],
  },
  sendAt: {
    type: Date,
    default: Date.now,
  },
});

const message = mongoose.model("Message", messageSchema);

module.exports = message;
