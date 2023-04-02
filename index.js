const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const { swaggerDocs } = require("./swagger");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const db = require("./database");
var app = express();
var cors = require("cors");

app.use(cors());
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// linking routes
app.use(authRoute);
app.use(userRoute);

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome message to API.
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/", (req, res) => {
  res.status(200).json({ output: "Welcome to Insta API" });
});

app.post("/", (req, res) => {
  res.status(200).json({ output: "Welcome to Insta API" });
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.listen(process.env.PORT, () => {
  console.log("listening on port: ", process.env.PORT);
});
