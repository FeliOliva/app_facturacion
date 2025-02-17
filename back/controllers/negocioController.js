const negocioModel = require("../models/negocioModel");

const getNegocios = async (req, res) => {
    try {
        const negocios = await negocioModel.getNegocios();
        res.json(negocios);
    } catch (error) {
        console.error("Error al obtener los negocios:", error);
        res.status(500).json({ error: "Error al obtener los negocios" });
    }
};
const addNegocio = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        if (!nombre || !direccion) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        const newNegocio = await negocioModel.addNegocio({ nombre, direccion });
        res.json(newNegocio);
    } catch (error) {
        console.error("Error al agregar un negocio:", error);
        res.status(500).json({ error: "Error al agregar el negocio" });
    }
}
const updateNegocio = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const { nombre, direccion } = req.body;
        if (!nombre || !direccion) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        const updatedNegocio = await negocioModel.updateNegocio({ id, nombre, direccion });
        res.json(updatedNegocio);
    } catch (error) {
        console.error("Error al actualizar el negocio:", error);
        res.status(500).json({ error: "Error al actualizar el negocio" });
    }
}
const deleteNegocio = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const deletedNegocio = await negocioModel.deleteNegocio(id);
        res.json(deletedNegocio);
    } catch (error) {
        console.error("Error al eliminar el negocio:", error);
        res.status(500).json({ error: "Error al eliminar el negocio" });
    }
}
const upNegocio = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const upNegocio = await negocioModel.upNegocio(id);
        res.json(upNegocio);
    } catch (error) {
        console.error("Error al activar el negocio:", error);
        res.status(500).json({ error: "Error al activar el negocio" });
    }
}
module.exports = { getNegocios, addNegocio, updateNegocio, deleteNegocio, upNegocio };