const express = require("express");
const router = express.Router();
const notasCreditoController = require("../controllers/notasCreditoController");
const { verifyToken } = require("../auth");

router.get("/notasCredito", verifyToken, notasCreditoController.getNotasCredito);
router.get("/notasCredito/:id", verifyToken, notasCreditoController.getNotasCreditoById);
router.get("/notasCreditoByCliente/:clienteId", verifyToken, notasCreditoController.getNotasCreditoByClienteId);
router.get("/notasCreditoByNegocio/:negocioId", verifyToken, notasCreditoController.getNotasCreditoByNegocioId);
router.post("/notasCredito", verifyToken, notasCreditoController.addNotasCredito);
router.put("/notasCredito/:id", verifyToken, notasCreditoController.updateNotasCredito);
router.delete("/notasCredito/:id", verifyToken, notasCreditoController.dropNotasCredito);
router.post("/notasCredito/:id", verifyToken, notasCreditoController.upNotasCredito);

module.exports = router;