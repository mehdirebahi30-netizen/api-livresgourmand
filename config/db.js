const mysql = require("mysql2");
require("dotenv").config(); 

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port : process.env.DB_PORT || 3307
});

db.connect((err) => {
  if (err) {
    console.error("Erreur connexion DB :", err);
    return;
  }
  console.log("Connecté à la base MySQL !");
});

module.exports = db;