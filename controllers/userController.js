let userController = {};
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { sign } = jwt;
const JWT_SECRET = "xyz@900";
let conn = require("../dbConfig/connection");
userController.userLogin = async (req, res) => {
  res.render("userLogin.ejs");
};
userController.logoutPage = async (req, res) => {
  res.clearCookie("jwtUserToken");
  res.redirect("/");
};
userController.orderDetails = async (req, res) => {
  res.render("viewUserOrders.ejs", { user_id: req.user });
};
userController.addToCartPage = async (req, res) => {
  res.render("cartPage.ejs", { loggedIn: req.loggedIn });
};
userController.checkOutPage = async (req, res) => {
  let { user_id } = req.user;
  res.render("checkOutPage.ejs", { loggedIn: req.loggedIn, user_id: user_id });
};
userController.userSignUp = async (req, res) => {
  res.render("userCreateAccount.ejs");
};
userController.changePassword = async (req, res) => {
  res.render("userChangePassword.ejs");
};
userController.dashboardPage = async (req, res) => {
  res.render("userDashboard.ejs");
};
userController.forgotPassword = async (req, res) => {
  res.render("userForgotPassword.ejs");
};
userController.setUserPassword = async (req, res) => {
  res.render("setUserPassword.ejs", { email: req.params.email });
};
userController.userOTPVerify = async (req, res) => {
  res.render("userOTPVerification.ejs", { email: req.params.email });
};
userController.wishlistItems = async (req, res) => {
  let selectSql = `
SELECT wishlist.*, products.name, products.price, products.photo
FROM wishlist
INNER JOIN products ON wishlist.product_id = products.product_id;
`;

  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      res.json({ error: false, message: "", data: row });
    }
  });
};
userController.getProductDetails = async (req, res) => {
  let { user_id } = req.user;
  let { id } = req.params;
  let getQuery = `select products.product_id as id, products.name as name,products.photo as photo,products.price as price,products.net_price as net_price, bill_details.quantity from bill_details Inner Join products on products.product_id=bill_details.product_id where bill_id=${id}`;
  conn.query(getQuery, (error, records) => {
    if (error) {
      res.json({ error: error.message, message: "" });
    } else {
      res.json({ error: "", records: records });
    }
  });
};
userController.addReviews = async (req, res) => {};
userController.GetUserOrders = async (req, res) => {
  let { user_id } = req.user;
  let selectQuery = `select * from bill where user_id=${user_id}`;
  conn.query(selectQuery, (error, record) => {
    if (error) {
      res.json({ error: error.message, message: "" });
    } else {
      res.json({ error: false, record: record });
    }
  });
};
userController.cartData = async (req, res) => {
  let { user_id } = req.user;
  const productId = req.params.id;
  console.log(productId);
  let selectSql = `Select * from cart where product_id='${productId}' and user_id='${user_id}'`;
  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      if (row.length > 0) {
        res.json({ error: true, message: "Product already exists!" });
      } else {
        let sql = `INSERT INTO cart (user_id, product_id, quantity)values('${user_id}','${productId}','1')`;
        conn.query(sql, (e) => {
          if (e) {
            res.json({ error: true, message: e.message });
          } else {
            res.json({ error: false, message: res.message });
          }
        });
      }
    }
  });
};
userController.WishlistData = async (req, res) => {
  let { user_id } = req.user;
  const productId = req.params.id;
  console.log(productId);
  let selectSql = `Select * from wishlist where product_id='${productId}' and user_id='${user_id}'`;
  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      if (row.length > 0) {
        res.json({ error: true, message: "Product already exists!" });
      } else {
        let sql = `INSERT INTO wishlist (user_id, product_id)values('${user_id}','${productId}')`;
        conn.query(sql, (e) => {
          if (e) {
            res.json({ error: true, message: e.message });
          } else {
            res.json({ error: false, message: res.message });
          }
        });
      }
    }
  });
};
userController.updateUserPassword = async (req, res) => {
  let { user_id } = req.user;
  console.log(user_id);
  console.log(req.body);
  let { oldPassword, newPassword, confirmPassword } = req.body;
  let selectSql = `Select * from users_info where user_id='${user_id}'`;
  conn.query(selectSql, (err, row) => {
    if (err) res.json({ error: true, message: err.message });
    else {
      if (row.length > 0) {
        if (oldPassword == row[0].password) {
          if (newPassword == confirmPassword) {
            let updateSql = `Update users_info set password='${newPassword}' where user_id='${user_id}'`;
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
        res.json({ error: true, message: "User not found!" });
      }
    }
  });
};
userController.userInfoData = async (req, res) => {
  try {
    console.log(req.body);
    let { email, password } = req.body;
    let selectSql = `select * from users_info where email='${email}' and password='${password}'`;
    console.log(selectSql);
    conn.query(selectSql, (e, row) => {
      if (e) res.json({ error: true, message: e.message });
      else {
        if (row.length > 0) {
          sign(
            {
              user_id: row[0].user_id,
              email: row[0].email,
              password: row[0].password,
            },
            JWT_SECRET,
            { expiresIn: "1d" },
            (e, token) => {
              if (e) res.json({ error: true, message: e.message });
              else {
                console.log(token);
                res.cookie("jwtUserToken", token, "1d");
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
userController.signUpUser = async (req, res) => {
  try {
    console.log(req.body);
    let { fname, lname, phone, email, password, address, pincode } = req.body;
    let selectSql = `Select * from users_info where email='${email}'`;
    conn.query(selectSql, (e, row) => {
      if (e) {
        console.log(e);
      } else {
        if (row.length > 0) {
          alert("User already exists!");
        } else {
          let sql = `INSERT INTO users_info (firstName, lastName, phone, email, password, address,pincode)values('${fname}','${lname}','${phone}','${email}','${password}','${address}','${pincode}')`;
          conn.query(sql, (e) => {
            if (e) {
              res.json({ error: true, message: e.message });
            } else {
              res.json({ error: false, message: res.message });
            }
          });
        }
      }
    });
  } catch {
    console.log("error");
  }
};
userController.updateQuantity = async (req, res) => {
  console.log("ajhdljchlc");
  let { id } = req.params;
  let { user_id } = req.user;

  let { quantity } = req.body;
  console.log(id);
  console.log(user_id);
  console.log(quantity);
  let updateQuery = `update cart set quantity = ${quantity} where user_id=${user_id} and product_id=${id}`;
  conn.query(updateQuery, (error) => {
    if (error) {
      res.json({ error: error.message, message: "" });
    } else {
      res.json({ error: "", message: "" });
    }
  });
};
userController.DeleteItem = async (req, res) => {
  let { id } = req.params;
  let { user_id } = req.user;
  console.log(id);
  console.log(user_id);

  let deleteQuery = `delete from cart where product_id=${id} and user_id=${user_id}`;
  conn.query(deleteQuery, (error) => {
    if (error) {
      res.json({ error: error.message, message: "" });
    } else {
      res.json({ error: "", message: "Product Removed Successfully" });
    }
  });
};
userController.DeleteItem = async (req, res) => {
  let { id } = req.params;
  let { user_id } = req.user;
  console.log(id);
  console.log(user_id);

  let deleteQuery = `delete from wishlist where product_id=${id} and user_id=${user_id}`;
  conn.query(deleteQuery, (error) => {
    if (error) {
      res.json({ error: error.message, message: "" });
    } else {
      res.json({ error: "", message: "Product Removed Successfully" });
    }
  });
};
userController.userCartProducts = async (req, res) => {
  let { user_id } = req.user;
  console.log(user_id);

  let query = `SELECT 
  c.id AS cart_id, 
  c.user_id, 
  c.product_id, 
  c.quantity, 
  p.name, 
  p.description, 
  p.price, 
  p.photo,
  p.net_price
FROM cart c
INNER JOIN products p ON c.product_id = p.product_id
WHERE c.user_id = '${user_id}'`;

  console.log(query);

  conn.query(query, (error, results) => {
    if (error) {
      res.json({ error: true, message: error.message });
    } else if (results.length === 0) {
      res.json({ error: true, message: "No items found in the cart" });
    } else {
      res.json({ error: false, data: results });
    }
  });
};
userController.userDetails = async (req, res) => {
  let { user_id } = req.user;

  let selectSql = `Select * from users_info where user_id='${user_id}'`;
  console.log(selectSql);
  conn.query(selectSql, (error, results) => {
    if (error) {
      res.json({ error: true, message: error.message });
    } else {
      res.json({ error: false, data: results[0] });
    }
  });
};
userController.userCheckOutItems = async (req, res) => {
  let { user_id } = req.user;
  console.log(user_id);

  let query = `SELECT 
  c.id AS cart_id, 
  c.user_id, 
  c.product_id, 
  c.quantity, 
  p.name, 
  p.description, 
  p.price, 
  p.photo,
  p.net_price
FROM cart c
INNER JOIN products p ON c.product_id = p.product_id
WHERE c.user_id = '${user_id}'`;

  console.log(query);

  conn.query(query, (error, results) => {
    if (error) {
      res.json({ error: true, message: error.message });
    } else if (results.length === 0) {
      res.json({ error: true, message: "No items found in the cart" });
    } else {
      res.json({ error: false, data: results });
    }
  });
};

userController.countCartItems = (req, res) => {
  let { user_id } = req.user;

  let getQuery = `select count(*) as count from cart where user_id=${user_id}`;
  conn.query(getQuery, (error, record) => {
    if (error) {
      res.json({ error: error.message, message: "" });
    } else {
      res.json({ error: "", record: record });
    }
  });
};

userController.viewCategories = async (req, res) => {
  let selectSql = `Select * from categories`;
  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      res.json({ error: false, message: "", data: row });
    }
  });
};
userController.viewProducts = async (req, res) => {
  let selectSql = `Select * from products`;
  conn.query(selectSql, (e, row) => {
    if (e) {
      console.log(e);
    } else {
      res.json({ error: false, message: "", data: row });
    }
  });
};
userController.BookingInfo = (req, res) => {
  console.log(req.body);
  let {
    city,
    state,
    phone,
    address,
    payment,
    pincode,
    user_id,
    total,
    date_time,
    payment_status,
    payment_date,
  } = req.body;
  console.log(req.body);
  if (payment === "cod") {
    let insertQuery = `
  INSERT INTO bill (
    total, date_time, payment_mode, address, pincode, phone_no, user_id, payment_status, payment_date, city, state
  ) VALUES (
    ${total},
    '${date_time}',
    '${payment}',
    '${address}',
    '${pincode}',
    '${phone}',
    '${user_id}',
    ${payment_status ? `'${payment_status}'` : "NULL"},
    ${payment_date ? `'${payment_date}'` : "NULL"},
    '${city}',
    '${state}'
  )`;
    conn.query(insertQuery, (error) => {
      if (error) {
        res.json({ error: error.message, message: "" });
      } else {
        let selectQuery = `select * from bill where user_id=${user_id} ORDER BY date_time DESC LIMIT 1`;

        conn.query(selectQuery, (error, record) => {
          if (error) {
            res.json({ error: error.message, message: "" });
          } else {
            let getQuery = `select products.price as price, products.net_price as net_price,products.product_id as id, cart.quantity from cart Inner Join products on products.product_id=cart.product_id where user_id=${user_id}`;
            conn.query(getQuery, (error, record1) => {
              if (error) {
                res.json({ error: error.message, message: "" });
              } else {
                for (let i = 0; i < record1.length; i++) {
                  let insertQuery = `insert into bill_details(bill_id,product_id,quantity,price,net_price)values(${record[0].id},${record1[i].id},${record1[i].quantity},${record1[i].price},${record1[i].net_price})`;
                  conn.query(insertQuery, (error, record2) => {
                    if (error) {
                      res.json({ error: error.message, message: "" });
                    } else {
                      let deleteQuery = `delete from cart where user_id=${user_id}`;
                      conn.query(deleteQuery, (error) => {
                        if (error) {
                          res.json({ error: error.message, message: "" });
                        }
                      });
                    }
                  });
                }

                res.json({ error: "", message: "Order Placed Successfully" });
              }
            });
          }
        });
      }
    });
  } else {
    let insertQuery = `insert into bill(total,date_time,payment_mode,address,pincode,city,state,phone_no,user_id,payment_status,payment_date)Values
  (${total},'${date_time}','${payment}','${address}',${pincode},'${city}','${state}','${phone}',${user_id},'paid','${payment_date}')`;
    conn.query(insertQuery, (error) => {
      if (error) {
        res.json({ error: error.message, message: "" });
      } else {
        let selectQuery = `select * from bill where user_id=${user_id} ORDER BY date_time DESC LIMIT 1`;
        conn.query(selectQuery, (error, record) => {
          if (error) {
            res.json({ error: error.message, message: "" });
          } else {
            let getQuery = `select products.price as price, products.net_price as net_price,products.product_id as id, cart.quantity from cart Inner Join products on products.product_id=cart.product_id where user_id=${user_id}`;
            conn.query(getQuery, (error, record1) => {
              if (error) {
                res.json({ error: error.message, message: "" });
              } else {
                for (let i = 0; i < record1.length; i++) {
                  let insertQuery = `insert into bill_details(bill_id,product_id,quantity,price,net_price)values(${record[0].id},${record1[i].id},${record1[i].quantity},${record1[i].price},${record1[i].net_price})`;
                  conn.query(insertQuery, (error, record2) => {
                    if (error) {
                      res.json({ error: error.message, message: "" });
                    } else {
                      let deleteQuery = `delete from cart where user_id=${user_id}`;
                      conn.query(deleteQuery, (error) => {
                        if (error) {
                          res.json({ error: error.message, message: "" });
                        }
                      });
                    }
                  });
                }
                res.json({ error: "", message: "Order Placed Successfully" });
              }
            });
          }
        });
      }
    });
  }
};
userController.generateUserPassword = async (req, res) => {
  console.log(req.body);
  let { email } = req.body;
  if (!email || !email.length) {
    res.json({ error: "Please enter email" });
  } else {
    let check = `select email from users_info where email= '${email}'`;
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
        let generateotp = `update users_info set otp = ${otp} where email= '${email}'`;
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
userController.verifyUserOTP = async (req, res) => {
  const { email } = req.params;
  console.log(email);
  const { otp } = req.body;
  // console.log(otp);

  let checkotp = `SELECT * FROM users_info WHERE email = '${email}'`;
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
userController.setNewPassword = async (req, res) => {
  const { email } = req.params;
  const { newpass } = req.body;
  console.log(email);

  let checkEmailSql = `SELECT * FROM users_info WHERE email='${email}'`;

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

    let updateSql = `UPDATE users_info SET password='${newpass}' WHERE email='${email}'`;
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

module.exports = userController;
