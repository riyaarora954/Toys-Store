var express = require("express");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { verify } = require("jsonwebtoken");
const JWT_SECRET = "xyz@900";
var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(express.static("public"));

router.use(cookieParser());
router.use(fileUpload({}));
const userController = require("../controllers/userController.js");
//Login user
router.get("/login", userController.userLogin);
router.post("/info", userController.userInfoData);
//Create Account
router.get("/SignUp", userController.userSignUp);
router.post("/signUpAction", userController.signUpUser);
router.get("/viewCategories", userController.viewCategories);
router.get("/viewProducts", userController.viewProducts);
router.get("/forgotPassword", userController.forgotPassword);
router.get("/logout", userController.logoutPage);
router.get("/changePassword", userController.changePassword);
router.get("/dashboard", userController.dashboardPage);
router.post("/generateUserPassword", userController.generateUserPassword);
router.get("/userSetPassword/:email", userController.setUserPassword);
router.get("/userOTPVerification/:email", userController.userOTPVerify);
router.post("/verify-User-OTP/:email", userController.verifyUserOTP);
router.post("/setNewPassword/:email", userController.setNewPassword);
router.get("/myCart", userController.addToCartPage);
router.get("/count", userAuthorization, userController.countCartItems);
router.get("/userDetails", userAuthorization, userController.userDetails);
router.get("/orderDetails", userAuthorization, userController.orderDetails);
router.get("/getUserOrders", userAuthorization, userController.GetUserOrders);
router.post("/submitReviews", userAuthorization, userController.addReviews);
router.get(
  "/getProductDetails/:id",
  userAuthorization,
  userController.getProductDetails
);
router.post("/booking", userAuthorization, userController.BookingInfo);

router.get("/cartProducts", userAuthorization, userController.userCartProducts);
router.get(
  "/checkOutItems",
  userAuthorization,
  userController.userCheckOutItems
);
router.post(
  "/updateQuantity/:id",
  userAuthorization,
  userController.updateQuantity
);
router.get("/deleteItem/:id", userAuthorization, userController.DeleteItem);
router.get(
  "/deleteWishlistItem/:id",
  userAuthorization,
  userController.DeleteItem
);
router.get(
  "/checkOut",
  userAuthorization_HTTP_Request,
  userController.checkOutPage
);

router.get("/myCartData/:id", userAuthorization, userController.cartData);
router.get(
  "/myWishlistData/:id",
  userAuthorization,
  userController.WishlistData
);
router.get(
  "/check-user-logged-in",
  userAuthorization_HTTP_Request,
  (req, res) => {
    res.json({ loggedIn: true });
  }
);
router.get(
  "/viewWishlistItems",
  userAuthorization,
  userController.wishlistItems
);
router.post(
  "/updatePassword",
  userAuthorization,
  userController.updateUserPassword
);
function userAuthorization(req, res, next) {
  try {
    let accessToken = req.cookies.jwtUserToken;
    if (!accessToken) {
      return res.redirect("/userSignUp");
    }
    let secret = "xyz@900";
    try {
      req.user = jwt.verify(accessToken, secret);
      next();
    } catch (error) {
      res.redirect("/userSignUp");
    }
  } catch (e) {
    console.log(e);
  }
}
function userAuthorization_HTTP_Request(req, res, next) {
  try {
    let accessToken = req.cookies.jwtUserToken;
    if (!accessToken) {
      return res.json({ loggedIn: false });
    }
    let secret = "xyz@900";
    try {
      req.user = jwt.verify(accessToken, secret);
      next();
    } catch (error) {
      res.json({ loggedIn: false });
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = router;
