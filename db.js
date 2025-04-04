const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 8889
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la BD:', err.message);
        return;
    }
    console.log('Conexión a la base de datos MySQL exitosa!');
});

module.exports = db;