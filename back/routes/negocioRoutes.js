const express = require("express");
const router = express.Router();
const negocioController = require("../controllers/negocioController");
const { verifyToken } = require("../auth");

router.get("/negocios", verifyToken, negocioController.getNegocios);
router.post("/negocios", verifyToken, negocioController.addNegocio);

module.exports = router;