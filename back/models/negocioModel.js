const { pool } = require("../db"); // Importas el pool

const getNegocios = async () => {
    try {
        const [rows] = await pool.execute("SELECT * FROM negocio");
        return rows;
    } catch (error) {
        console.error("Error consultando negocios:", error);
        throw error;
    }
};

const addNegocio = async ({ nombre, direccion }) => {
    try {
        const [rows] = await pool.execute("INSERT INTO negocio (nombre, direccion) VALUES (?, ?)", [nombre, direccion]);
        return rows;
    } catch (error) {
        console.error("Error consultando negocios:", error);
        throw error;
    }
};
module.exports = { getNegocios, addNegocio };