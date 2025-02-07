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

module.exports = { getNegocios, addNegocio };