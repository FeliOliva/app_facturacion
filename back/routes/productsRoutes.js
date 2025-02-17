const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../auth");

router.get("/products", verifyToken, productController.getAllProducts);
router.post("/products", verifyToken, productController.addProduct);
router.put("/products/:id", verifyToken, productController.updateProduct);
router.delete("/products/:id", verifyToken, productController.deleteProduct);
router.post("/products/:id", verifyToken, productController.upProduct);

module.exports = router;