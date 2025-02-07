const clientModel = require("../models/clientModel");

const getClients = async (req, res) => {
    try {
        const clientes = await clientModel.getClients();
        res.json(clientes);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ error: "Error al obtener los clientes" });
    }
};
const addClient = async (req, res) => {
    try {
        const { nombre, apellido, negocio_id, telefono, editable, rol_usuario } = req.body
        if (rol_usuario !== 0) {
            return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
        }
        if (!nombre || !apellido || !negocio_id || editable === undefined) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        // Validar que editable sea 0 o 1
        if (![0, 1].includes(editable)) {
            return res.status(400).json({ error: "El campo 'editable' debe ser 0 o 1" });
        }
        const newClient = await clientModel.addClient({ nombre, apellido, negocio_id, telefono, editable });
        res.json(newClient);
    }
    catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ error: "Error al obtener los clientes" });
    }
}


module.exports = { getClients, addClient };