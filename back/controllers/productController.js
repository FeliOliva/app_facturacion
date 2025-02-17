const productsModel = require("../models/productModel");

const getAllProducts = async () => {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ error: "Los parámetros de paginación no son válidos" });
        }

        const result = await productsModel.getAllClientsPaginated(pageNumber, limitNumber);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
}