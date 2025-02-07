const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getUserByUsername = async (usuario) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM usuario WHERE usuario = ?", [usuario]);
        return rows[0];
    } catch (error) {
        console.error("Error consultando usuario:", error);
        throw error;
    }
};


// Exportación corregida
module.exports = { pool, getUserByUsername };
