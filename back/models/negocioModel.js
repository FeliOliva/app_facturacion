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
        console.error("Error agregado el negocio:", error);
        throw error;
    }
};

const updateNegocio = async ({ id, nombre, direccion }) => {
    try {
        const [rows] = await pool.execute("UPDATE negocio SET nombre = ?, direccion = ? WHERE id = ?", [nombre, direccion, id]);
        return rows;
    } catch (error) {
        console.error("Error eliminando el negocio:", error);
        throw error;
    }
}

const deleteNegocio = async (id) => {
    try {
        const [rows] = await pool.execute("update negocio set estado = 0 where id = ?", [id]);
        return rows;
    } catch (error) {
        console.error("Error eliminando el negocio:", error);
        throw error;
    }
}

const upNegocio = async (id) => {
    try {
        const [rows] = await pool.execute("update negocio set estado = 1 where id = ?", [id]);
        return rows;
    } catch (error) {
        console.error("Error eliminando el negocio:", error);
        throw error;
    }
}
module.exports = { getNegocios, addNegocio, updateNegocio, deleteNegocio, upNegocio };