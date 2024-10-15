let mysql = require("mysql");
require("dotenv").config();
let { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
let conn = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});
conn.connect((e) => {
  if (e) {
    console.log(res.message);
  } else {
    console.log("Connected to database");
  }
});
module.exports = conn;
