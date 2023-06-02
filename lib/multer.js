const multer = require("multer");
const path = require("path");

module.exports = multer({
  dest: "public/uploads",
  fileFilter: (req, file, cb) => {
    let extension = path.extname(file.originalname);
    if (
      extension !== ".mp4" &&
      extension !== ".jpg" &&
      extension !== ".jpeg" &&
      extension !== ".png"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
