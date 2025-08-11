var express = require("express");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const indexController = require("../controllers/indexController.js");
var router = express.Router();
router.use(cookieParser());
router.get("/", userAuthorization_HTTP_Request, indexController.homePage);
router.get(
  "/contactUs",
  userAuthorization_HTTP_Request,
  indexController.contactUsPage
);
router.get(
  "/aboutUs",
  userAuthorization_HTTP_Request,
  indexController.aboutUsPage
);
router.get("/wishlist", indexController.wishlistPage);
router.get(
  "/collection",
  userAuthorization_HTTP_Request,
  indexController.collectionPage
);
router.get("/viewCollection", indexController.collections);
router.get(
  "/viewProductsByCategory/:id",
  userAuthorization_HTTP_Request,
  indexController.products
);
router.get(
  "/productsByCategory/:id",

  indexController.productsByCategory
);
router.get(
  "/productPage/:id",
  userAuthorization_HTTP_Request,
  indexController.productsPage
);
router.get("/product/:id", indexController.singleProductPage);

function userAuthorization_HTTP_Request(req, res, next) {
  const accessToken = req.cookies.jwtUserToken;
  if (!accessToken) {
    req.loggedIn = false;
    return next();
  }

  try {
    const secret = "xyz@900";
    req.user = jwt.verify(accessToken, secret);
    req.loggedIn = true;
  } catch (error) {
    req.loggedIn = false;
  }

  next();
}

module.exports = router;
