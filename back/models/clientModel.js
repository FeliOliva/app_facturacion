const { pool } = require("../db");

const getClients = async () => {
    try {
        const [rows] = await pool.execute("SELECT * FROM cliente");
        return rows;
    } catch (error) {
        console.error("Error consultando clientes:", error);
        throw error;
    }
};

const addClient = async ({ nombre, apellido, negocio_id, telefono, editable }) => {
    try {
        const [rows] = await pool.execute("INSERT INTO cliente (nombre, apellido, negocio_id, telefono, editable) VALUES (?, ?, ?, ?, ?)", [nombre, apellido, negocio_id, telefono, editable]);
        return rows;
    } catch (error) {
        console.error("Error consultando clientes:", error);
        throw error;
    }
}
module.exports = { getClients, addClient };