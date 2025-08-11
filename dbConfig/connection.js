let mysql = require("mysql");
require("dotenv").config();

let { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

let conn = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT, // ✅ Important for Railway public network
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

conn.connect((e) => {
  if (e) {
    console.log("❌ Database connection failed:", e.message);
  } else {
    console.log("✅ Connected to database");
  }
});

module.exports = conn;
