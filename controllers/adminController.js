let adminController = {};

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { sign } = jwt;
const JWT_SECRET = "xyz@900";

let conn = require("../dbConfig/connection.js");
adminController.adminDashboard = async (req, res) => {
  res.render("adminDashboard");
};
adminController.viewAllOrders = async (req, res) => {
  res.render("viewAllOrders.ejs");
};
adminController.adminPanel = async (req, res) => {
  res.render("adminPanel.ejs");
};
adminController.changePassword = async (req, res) => {
  res.render("adminChangePassword");
};
adminController.adminLogout = async (req, res) => {
  res.clearCookie("jwtAdminToken");
  res.redirect("/admin/login");
};
adminController.products = async (req, res) => {
  res.render("manageProducts.ejs");
};
adminController.forgotPassword = async (req, res) => {
  res.render("adminForgotPassword.ejs");
};
adminController.GetAllOrders = async (req, res) => {
  let selectQuery = `select * from bill `;
  conn.query(selectQuery, (error, record) => {
    if (error) {
      res.json({ error: error.message, message: "" });
    } else {
      res.json({ error: false, record: record });
    }
  });
};
adminController.adminInfoData = async (req, res) => {
  try {
    console.log(req.body);
    let { email, password } = req.body;
    let selectSql = `select * from admin where email='${email}' and password='${password}'`;
    console.log(selectSql);
    conn.query(selectSql, (e, row) => {
      if (e) res.json({ error: true, message: e.message });
      else {
        if (row.length > 0) {
          sign(
            {
              admin_id: row[0].admin_id,
              email: row[0].email,
              password: row[0].password,
            },
            JWT_SECRET,
            { expiresIn: "1d" },
            (e, token) => {
              if (e) res.json({ error: true, message: e.message });
              else {
                console.log(token);
                res.cookie("jwtAdminToken", token, "1d");
                res.json({
                  error: false,
                  message: "Logged in successfully",
                  data: token,
                });
              }
            }
          );
        } else {
          res.json({ error: true, message: "Data not matched" });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
};
adminController.updatePassword = async (req, res) => {
  let { admin_id } = req.admin;
  console.log(admin_id);
  console.log(req.body);
  let { oldPassword, newPassword, confirmPassword } = req.body;
  let selectSql = `Select * from admin where admin_id='${admin_id}'`;
  conn.query(selectSql, (err, row) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      if (row.length > 0) {
        if (oldPassword == row[0].password) {
          if (newPassword == confirmPassword) {
            let updateSql = `Update admin set password='${newPassword}' where admin_id='${admin_id}'`;
            conn.query(updateSql, (err) => {
              if (err) res.json({ error: true, message: err.message });
              else {
                res.json({
                  error: false,
                  message: "Password Updated Successfully!",
                });
              }
            });
          } else {
            res.json({
              error: true,
              message: "New Password and Confirm Password does not match!",
            });
          }
        } else {
          res.json({ error: true, message: "Old Password does not matches!" });
        }
      } else {
        res.json({ error: true, message: "Admin not found!" });
      }
    }
  });
};
adminController.verifyAdminOTP = async (req, res) => {
  const { email } = req.params;
  console.log(email);
  const { otp } = req.body;
  // console.log(otp);

  let checkotp = `SELECT * FROM admin WHERE email = '${email}'`;
  conn.query(checkotp, (error, records) => {
    if (error) {
      return res.json({
        error: true,
        message: "Database query error",
      });
    }

    if (records.length === 0) {
      return res.json({
        error: true,
        message: "No user with this email",
      });
    }
    let otp1 = otp;
    console.log(otp1);
    console.log(records[0].otp);
    if (otp1 === records[0].otp) {
      return res.json({
        error: false,
        message: "OTP verified successfully",
      });
    } else {
      return res.json({
        error: true,
        message: "The OTP provided is incorrect",
      });
    }
  });
};
adminController.setNewPassword = async (req, res) => {
  const { email } = req.params;
  const { newpass } = req.body;
  console.log(email);

  let checkEmailSql = `SELECT * FROM admin WHERE email='${email}'`;

  conn.query(checkEmailSql, (err, results) => {
    if (err) {
      console.error(err);
      return res.json({
        error: true,
        message: "Database query error",
      });
    }

    if (results.length === 0) {
      return res.json({
        error: true,
        message: "Email does not exist",
      });
    }

    let updateSql = `UPDATE admin SET password='${newpass}' WHERE email='${email}'`;
    console.log(updateSql);

    conn.query(updateSql, (err) => {
      if (err) {
        console.error(err);
        res.json({
          error: true,
          message: "Database query error",
        });
      } else {
        res.json({
          error: false,
          message: "Password updated successfully",
        });
      }
    });
  });
};
adminController.setAdminPassword = async (req, res) => {
  res.render("setAdminPassword.ejs", { email: req.params.email });
};
adminController.adminOTPVerify = async (req, res) => {
  res.render("adminOTPVerification.ejs", { email: req.params.email });
};
adminController.categories = async (req, res) => {
  res.render("manageCategories.ejs");
};
adminController.generateAdminPassword = async (req, res) => {
  console.log(req.body);
  let { email } = req.body;
  if (!email || !email.length) {
    res.json({ error: "Please enter email" });
  } else {
    let check = `select email from admin where email= '${email}'`;
    console.log(check);
    conn.query(check, (error, results) => {
      //console.log(results)
      //console.log(email)
      if (error) {
        res.json({ error: error.message, message: "" });
      } else if (results.length === 0) {
        res.json({ error: "Email does not exist" });
      } else {
        // Generate a random OTP (e.g., 6-digit number)
        const otp = Math.floor(100000 + Math.random() * 900000);
        //console.log(otp)
        let generateotp = `update admin set otp = ${otp} where email= '${email}'`;
        // console.log(generateotp)
        conn.query(generateotp, (error, results) => {
          if (error) {
            res.json({ error: error.message, message: "" });
          } else {
            // Send OTP to the email address using a mailer service (e.g., Nodemailer)
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false, // or 'STARTTLS'
              auth: {
                user: "arorariya954@gmail.com",
                pass: "xsyl bfup awon myjn",
              },
            });

            const mailOptions = {
              from: "arorariya954@gmail.com",
              to: email,
              subject: "User OTP Verification",
              text: `Your OTP is: ${otp}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                res.json({ error: "Failed to send OTP", message: "" });
              }

              // console.log('OTP sent to', email);
              res.json({ error: "", message: "OTP sent successfully" });
            });
          }
        });
      }
    });
  }
};
adminController.saveCategory = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  let { photo } = req.files;
  let { categoryName, description } = req.body;
  let selectSql = `Select * from categories where category_name='${categoryName}'`;
  conn.query(selectSql, (err, row) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      if (row.length > 0) {
        res.json({ error: true, message: "Category already exists!" });
      } else {
        let dbPath = "/assets/images/admin/categories/" + photo.name;
        let realPath = "/public/assets/images/admin/categories/" + photo.name;
        photo.mv(realPath, (err) => {
          if (err) res.json({ error: true, message: err.message });
          else {
            let insertSql = `INSERT INTO categories(category_name, description, photo) VALUES('${categoryName}', '${description}', '${dbPath}')`;

            conn.query(insertSql, (err) => {
              if (err) res.json({ error: true, message: err.message });
              else {
                res.json({
                  error: false,
                  message: "Category Added Successfully!",
                });
              }
            });
          }
        });
      }
    }
  });
};
adminController.viewCategories = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  let selectSql = `SELECT * FROM categories `;
  conn.query(selectSql, (err, rows) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      res.json({ error: false, records: rows });
    }
  });
};
adminController.viewProducts = async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);
  const query = `
    SELECT p.product_id, p.name, p.description, p.price, p.discount, p.net_price, p.photo, c.category_name
    FROM products p
    JOIN categories c ON p.category_id = c.category_id;
  `;
  console.log(query);
  conn.query(query, (err, rows) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      res.json({ error: false, records: rows });
    }
  });
};
adminController.getCategory = async (req, res) => {
  console.log(req.params);
  let { category_id } = req.params;
  let selectSql = `Select * from categories where category_id='${category_id}'`;
  conn.query(selectSql, (e, row) => {
    if (e) {
      res.json({ error: true, message: e.message });
    } else {
      res.json({ error: false, message: "Data fetched", records: row[0] });
    }
  });
};
adminController.getProduct = async (req, res) => {
  console.log(req.params);
  let { product_id } = req.params;
  let selectSql = `Select * from products where product_id='${product_id}'`;
  conn.query(selectSql, (e, row) => {
    if (e) {
      res.json({ error: true, message: e.message });
    } else {
      res.json({ error: false, message: "Data fetched", records: row[0] });
    }
  });
};
adminController.delCategory = async (req, res) => {
  let { category_id } = req.params;
  let deleteSql = `DELETE FROM categories WHERE category_id='${category_id}'`;
  conn.query(deleteSql, (err, rows) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      res.json({ error: false, message: "Category deleted successfully!" });
    }
  });
};
adminController.delProduct = async (req, res) => {
  let { product_id } = req.params;
  let deleteSql = `DELETE FROM products WHERE product_id='${product_id}'`;
  conn.query(deleteSql, (err, rows) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      res.json({ error: false, message: "Category deleted successfully!" });
    }
  });
};

adminController.updateCategory = async (req, res) => {
  console.log(req.body);

  let { categoryName, description, category_id } = req.body;
  if (req.files === null) {
    let updateSql = `Update categories set category_name='${categoryName}',description='${description}' where category_id='${category_id}'`;
    console.log(updateSql);
    conn.query(updateSql, (e) => {
      if (e) {
        res.json({ error: true, message: e.message });
      } else {
        res.json({
          error: false,
          message: "Data Updated",
        });
      }
    });
  } else {
    let { photo } = req.files;
    let dbPath = "/assets/images/admin/categories/" + photo.name;
    let realPath = "public/assets/images/admin/categories/" + photo.name;
    photo.mv(realPath, (err) => {
      if (err) {
        res.json({ error: true, message: err.message });
      } else {
        let updateSql = `Update categories set category_name='${categoryName}',description='${description}', photo='${dbPath}' where category_id='${category_id}'`;
        console.log(updateSql);
        conn.query(updateSql, (e) => {
          if (e) {
            res.json({ error: true, message: e.message });
          } else {
            res.json({
              error: false,
              message: "Data Updated",
            });
          }
        });
      }
    });
  }
};
adminController.updateProduct = async (req, res) => {
  console.log(req.body);
  let { product_id, productName, description, price, discount, enetPrice } =
    req.body;
  if (req.files === null) {
    let updateSql = `Update products set name='${productName}',description='${description}',price='${price}',discount='${discount}',net_price='${enetPrice}' where product_id='${product_id}'`;
    console.log(updateSql);
    conn.query(updateSql, (e) => {
      if (e) {
        res.json({ error: true, message: e.message });
      } else {
        res.json({
          error: false,
          message: "Data Updated",
        });
      }
    });
  } else {
    let { photo } = req.files;
    let dbPath = "/assets/images/admin/products/" + photo.name;
    let realPath = "public/assets/images/admin/products/" + photo.name;
    photo.mv(realPath, (err) => {
      if (err) {
        res.json({ error: true, message: err.message });
      } else {
        let updateSql = `Update products set name='${productName}',description='${description}',price='${price}',discount='${discount}',net_price='${enetPrice}', photo='${dbPath}'where product_id='${product_id}'`;

        console.log(updateSql);
        conn.query(updateSql, (e) => {
          if (e) {
            res.json({ error: true, message: e.message });
          } else {
            res.json({
              error: false,
              message: "Data Updated",
            });
          }
        });
      }
    });
  }
};
adminController.saveProduct = async (req, res) => {
  console.log(req.body);
  let { photo } = req.files;
  console.log(photo);

  let { categories, productName, description, price, discount, netPrice } =
    req.body;
  let selectSql = `Select * from products where name='${productName}'`;
  conn.query(selectSql, (err, row) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      if (row.length > 0) {
        res.json({ error: true, message: "Product already exists!" });
      } else {
        let dbPath = "/assets/images/admin/products/" + photo.name;
        let realPath = "public/assets/images/admin/products/" + photo.name;
        photo.mv(realPath, (err) => {
          if (err) res.json({ error: true, message: err.message });
          else {
            let insertSql = `INSERT INTO products(name,category_id,net_price,description,price,discount, photo) VALUES('${productName}','${categories}','${netPrice}', '${description}','${price}','${discount}', '${dbPath}')`;

            conn.query(insertSql, (err) => {
              if (err) res.json({ error: true, message: err.message });
              else {
                res.json({
                  error: false,
                  message: "Product Added Successfully!",
                });
              }
            });
          }
        });
      }
    }
  });
};
adminController.getCategories = async (req, res) => {
  let selectSql = "Select * from categories";
  console.log(selectSql);
  conn.query(selectSql, (e, row) => {
    if (e) res.json({ error: true, message: e.message });
    else res.json({ error: false, message: "Data fetched", records: row });
  });
};

module.exports = adminController;
