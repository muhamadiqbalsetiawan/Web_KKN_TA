const mysql = require('mysql2');

const condb = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
});

module.exports = condb;

