require("dotenv").config();
const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/user.js");
const indexRouter = require("./routes/index.js");
const conn = require("./dbConfig/connection.js");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const app = express();

// Static + Views
app.use(express.static("public"));
app.set("view engine", "ejs");

// Middleware order matters
app.use(cookieParser());
app.use(fileUpload({})); // must come before urlencoded/json for multipart
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routers
app.use("/admin", adminRouter);
app.use("/", indexRouter);
app.use("/user", userRouter);

const port = 3000;
app.listen(port, (e) => {
  if (e) {
    console.error(e);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
