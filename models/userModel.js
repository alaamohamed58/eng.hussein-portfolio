const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "user name is required"],
  },
  email: {
    type: String,
    required: [true, "the email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "password provde the password"],
    select: false,
  },
  confirmedPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return this.password === v;
      },
      message: `Passwords do not match!`,
    },
  },
});

//hash the password
//hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmedPassword = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
