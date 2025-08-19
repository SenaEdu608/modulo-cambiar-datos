// db/conexion.js
const mysql = require("mysql2/promise");

// Configuración para la nueva base de datos
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "modulo-cambiar-datos",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;