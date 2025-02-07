const express = require("express");
const router = express.Router();
const clientControllers = require("../controllers/clientControllers");
const { verifyToken } = require("../auth"); 

router.get("/clientes", verifyToken, clientControllers.getClients);
router.post("/clientes", verifyToken, clientControllers.addClient);

module.exports = router;
