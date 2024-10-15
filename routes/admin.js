var express = require("express");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { verify } = require("jsonwebtoken");
var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(express.static("public"));

router.use(cookieParser());
router.use(fileUpload({}));
const adminController = require("../controllers/adminController.js");
router.get("/login", adminController.adminPanel);

router.get("/dashboard", adminAuthorization, adminController.adminDashboard);
router.get("/changePassword", adminController.changePassword);

router.post("/info", adminController.adminInfoData);
router.post(
  "/updatePassword",
  adminAuthorization,
  adminController.updatePassword
);
router.get("/logout", adminController.adminLogout);
router.get("/viewCategories", adminController.viewCategories);
router.get("/viewProducts", adminController.viewProducts);
router.get("/categories", adminController.categories);
router.get("/products", adminController.products);
router.get("/getCategories", adminController.getCategories);
router.post("/saveCategory", adminController.saveCategory);
router.post("/saveProduct", adminController.saveProduct);
router.get("/getCategory/:category_id", adminController.getCategory);
router.get("/getProduct/:product_id", adminController.getProduct);
router.get("/delCategory/:category_id", adminController.delCategory);
router.get("/delProduct/:product_id", adminController.delProduct);
router.get("/getAllOrders", adminController.GetAllOrders);

router.get("/forgotPassword", adminController.forgotPassword);
router.get("/orders", adminController.viewAllOrders);
router.post("/updateCategory", adminController.updateCategory);
router.post("/updateProduct", adminController.updateProduct);
router.get("/setPassword/:email", adminController.setAdminPassword);
router.post("/generatePassword", adminController.generateAdminPassword);
router.get("/OTPVerification/:email", adminController.adminOTPVerify);
router.post("/verify-OTP/:email", adminController.verifyAdminOTP);
router.post("/setNewPassword/:email", adminController.setNewPassword);
function adminAuthorization(req, res, next) {
  try {
    let accessToken = req.cookies.jwtAdminToken;
    if (!accessToken) {
      return res.redirect("/admin/login");
    }
    let secret = process.env.JWT_SECRET;
    try {
      req.admin = jwt.verify(accessToken, secret);
      next();
    } catch (error) {
      res.redirect("/admin/login");
    }
  } catch (e) {
    console.log(e);
  }
}
module.exports = router;
