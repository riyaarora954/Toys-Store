const express = require("express");
// const path = require("path");

const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/user.js");
const indexRouter = require("./routes/index.js");
// const conn = require("./dbConfig/connection.js");
// const jwt = require("jsonwebtoken");
// const fileUpload = require("express-fileupload");
// const cookieParser = require("cookie-parser");
// const { verify } = require("jsonwebtoken");

// const JWT_SECRET = "xyz@900";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");
// app.use(cookieParser());
// app.use(fileUpload({}));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use("/admin", adminRouter);
app.use("/", indexRouter);
app.use("/user", userRouter);

const port = 3000;
app.listen(port, (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
