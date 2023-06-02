const jwt = require("jsonwebtoken");
// verity the request
const verifyRequest = (req, res, next) => {
  var token = req.headers.authorization;
  if (token) {
    var verityToken = jwt.verify(token, process.env.JWT_SECRET);
    if (verityToken) {
      next();
    } else {
      res.status(403).json({
        output: "Unauthorized request",
      });
    }
  } else {
    res.status(403).json({
      output: "Unauthorized request",
    });
  }
};

module.exports = { verifyRequest };
