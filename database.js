const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connection = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database!");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = connection;
