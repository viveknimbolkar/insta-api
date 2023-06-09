const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_FACTOR = 10;

const userPost = mongoose.Schema({
  imageURL: {
    require: true,
    type: String,
  },
  originalFilename: {
    require: true,
    type: String,
  },
  createdAt: {
    require: true,
    type: String,
  },
});
const userSchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
  },
  email: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  username: {
    require: true,
    type: String,
  },
  website: {
    type: String,
  },
  bio: {
    type: String,
  },
  mobile: {
    type: String,
  },
  gender: {
    type: String,
  },
  posts: [userPost],
});

// encrypt password before storing
userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, SALT_FACTOR);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
