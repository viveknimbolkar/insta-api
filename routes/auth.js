const router = require("express").Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");



/**
 * @swagger
 * /login:
 *   post:
 *     description: login the user
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.post("/login", async (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          output: "Invalid email or password!",
        });
      }

      const payload = {
        email: user[0].email,
        name: user[0].name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      console.log(token);
      if (token) {
        return res.status(200).json({
          output: "Login successful",
          token: token,
        });
      } else {
        return res.status(200).json({
          output: "Incorrect email or password!",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        output: "server unreachable",
      });
      res.end();
    });
});



/**
 * @swagger
 * /register:
 *   post:
 *     description: register a new user
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.post("/register", async (req, res) => {
  var { name, email, password, username } = req.body;

  if (!name || !email || !password || !username) {
    res.status(200).json({
      message: "Empty fields are not allowed",
    });
    res.end();
  }

  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res.status(200).json({
      message: "User already exists",
    });
  }

  var customerData = {
    name: name,
    email: email,
    password: password,
    username: username,
  };

  try {
    const user = new User(customerData);
    const result = await user.save();

    if (result) {
      return res.status(200).json({
        output: "User registered successfully",
      });
    } else {
      return res.status(500).json({
        output: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      output: error,
    });
  }
});

module.exports = router;
