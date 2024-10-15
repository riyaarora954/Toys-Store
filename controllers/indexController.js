let indexController = {};
const jwt = require("jsonwebtoken");
const { sign } = jwt;
const JWT_SECRET = "xyz@900";
let conn = require("../dbConfig/connection");
indexController.homePage = async (req, res) => {
  res.render("homePage.ejs", { loggedIn: req.loggedIn });
};
indexController.contactUsPage = async (req, res) => {
  res.render("contactUs.ejs", { loggedIn: req.loggedIn });
};
indexController.wishlistPage = async (req, res) => {
  res.render("wishlistPage.ejs");
};
indexController.aboutUsPage = async (req, res) => {
  res.render("aboutUs.ejs", { loggedIn: req.loggedIn });
};
indexController.collectionPage = async (req, res) => {
  res.render("collection.ejs", { loggedIn: req.loggedIn });
};
indexController.productsPage = async (req, res) => {
  res.render("productPage.ejs", { id: req.params.id, loggedIn: req.loggedIn });
};
indexController.products = async (req, res) => {
  res.render("productsByCategory.ejs", {
    id: req.params.id,
    loggedIn: req.loggedIn,
  });
};
indexController.collections = async (req, res) => {
  let selectSql = `Select * from products`;
  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      res.json({ error: false, message: "", data: row });
    }
  });
};
indexController.productsByCategory = async (req, res) => {
  let selectSql = `
    SELECT products.*, categories.category_name, categories.description 
    FROM products 
    INNER JOIN categories ON products.category_id = categories.category_id 
    WHERE products.category_id = '${req.params.id}'
  `;

  console.log(selectSql);

  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      res.json({ error: false, message: "", data: row });
    }
  });
};
indexController.singleProductPage = async (req, res) => {
  let selectSql = `
  SELECT products.*, categories.category_id, categories.category_name 
  FROM products 
  INNER JOIN categories ON products.category_id = categories.category_id 
  WHERE products.product_id = '${req.params.id}'
`;

  console.log(selectSql);

  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      res.json({ error: false, message: "", data: row });
    }
  });
};

module.exports = indexController;
