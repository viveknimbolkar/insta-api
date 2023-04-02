const router = require("express").Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const verifyRequest = require("./auth.js");
const uniqueUsernameGenerator = require("unique-username-generator");

/**
 * @swagger
 * /user/update_profile:
 *   post:
 *     description: Update the user profile details
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: bio
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.post("/user/update_profile", verifyRequest, async (req, res) => {
  const { name, username, bio, email } = req.body;
  console.log(name, username, bio, email);

  const filter = { email: email };
  const updateParams = {
    $set: {
      name: name,
      username: username,
      bio: bio,
      email: email,
    },
  };
  User.updateOne(filter, updateParams)
    .then((data) => {
      console.log(data);
      if (data.modifiedCount > 0)
        res.status(200).json({ output: "Profile updated successfully" });
      else res.status(200).json({ output: "Profile not updated" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ output: "Something went wrong" });
    });
});

/**
 * @swagger
 * /user/suggest_username:
 *   get:
 *     description: get unique username
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.get("/user/suggest_username", async (req, res) => {
  const { email } = req.query;
  if (email) {
    res.status(200).json({
      suggestedUsername: uniqueUsernameGenerator.generateFromEmail(
        email,
        "3",
        "10"
      ),
    });
  } else {
    res.status(200).json({
      suggestedUsername: uniqueUsernameGenerator.generateUsername("", 3, 10),
    });
  }
});

/**
 * @swagger
 * /user/delete_account:
 *   get:
 *     description: Delete user account permanently
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.post("/user/delete_account", verifyRequest, async (req, res) => {
  User.deleteOne({ email: req.body.email })
    .then((data) => {
      if (data.deletedCount > 0) {
        res.status(200).json({ output: "Account deleted successfully" });
      } else {
        res.status(200).json({ output: "Failed to delete an account" });
      }
    })
    .catch((error) => {
      res
        .status(200)
        .json({ output: "Something went wrong. Try again later." });
    });
});
module.exports = router;
