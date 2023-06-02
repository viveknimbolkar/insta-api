const router = require("express").Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { verifyRequest } = require("../middlewares/verifyRequest.js");
const uniqueUsernameGenerator = require("unique-username-generator");
const cloudinary = require("../lib/cloudinary.js");
const upload = require("../lib/multer.js");
const path = require("path");
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

/**
 * @swagger
 * /user/add_post:
 *   post:
 *     description: add user post
 *     parameters:
 *       - in: formData
 *         name: post
 *         schema:
 *           type: file
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.post(
  "/user/add_post",
  verifyRequest,
  upload.single("post"),
  async (req, res) => {
    try {
      const email = jwt.decode(
        req.headers.authorization,
        process.env.JWT_SECRET
      ).email;

      
      if (req.file === undefined) {
        return res.status(200).json({ output: "File not provided." });
      }

      // we are saving file on local storage and cloudinary parallaly
      const result = await cloudinary.uploader.upload_large(req.file.path);
      if (result) {
        console.log(result);
      } else {
        console.log(result);
      }
      const imagePost = {
        imageURL: result.secure_url,
        originalFilename: result.original_filename,
        createdAt: result.created_at,
      };
      User.findOneAndUpdate({ email: email }, { $push: { posts: imagePost } })
        .exec()
        .then((data) => {
          return res
            .status(200)
            .json({ output: "Image uploaded successfully" });
        })
        .catch((error) => {
          return res.status(200).json({ output: error });
        });
    } catch (error) {
      console.log(error);
      return res.status(error.http_code).json({
        output: error.message,
      });
    }
    // if (result) {
    //   const filter = { email: req.body.email };
    //   const userPostUpdateParams = {
    //     $set: {
    //       "posts.$.imageURL": result.secure_url,
    //       "posts.$.originalFilename": result.original_filename,
    //       "posts.$.createdAt": result.created_at,
    //     },
    //   };
    //   User.updateOne(filter, userPostUpdateParams)
    //     .then((data) => {
    //       console.log(data);
    //       res.status(200).json({ output: "Image uploaded successfully." });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       res.status(200).json({ output: error });
    //     });
    // }
  }
);

/**
 * @swagger
 * /user/delete_image:
 *   post:
 *     description: delete user post image
 *     parameters:
 *       - in: query
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.post("/user/delete_image", verifyRequest, async (req, res) => {
  const email = jwt.decode(
    req.headers.authorization,
    process.env.JWT_SECRET
  ).email;

  if (!req.body.image_id) {
    return res.status(200).json({ output: "Image ID not provided." });
  }

  const getUser = await User.findOne({ email: email });
  console.log(getUser);
  // const cloudinaryInstance = await cloudinary.uploader.destroy(getUser.posts)
});

/**
 * @swagger
 * /user/get_images:
 *   post:
 *     description: delete user post image
 *     parameters:
 *       - in: query
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
router.post("/user/delete_image", verifyRequest, async (req, res) => {
  const email = jwt.decode(
    req.headers.authorization,
    process.env.JWT_SECRET
  ).email;

  if (!req.body.image_id) {
    return res.status(200).json({ output: "Image ID not provided." });
  }

  const getUser = await User.findOne({ email: email });
  console.log(getUser);
  // const cloudinaryInstance = await cloudinary.uploader.destroy(getUser.posts)
});

module.exports = router;
