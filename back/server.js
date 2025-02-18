const express = require("express");
require("dotenv").config();
const { generateToken, verifyToken } = require("./auth");
const { getUserByUsername } = require("./db");
const { prisma } = require("./db");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT;


//ROUTES
const clientsRoutes = require("./routes/clienteRoutes");
const negociosRoutes = require("./routes/negocioRoutes");
const rubrosRoutes = require("./routes/rubroRoutes");
const subRubrosRoutes = require("./routes/subRubroRoutes");
const productsRoutes = require("./routes/productsRoutes");
const ventaRoutes = require("./routes/ventasRoutes");





app.use(express.json());

// Ruta de login para generar un token
app.post("/login", async (req, res) => {
    const { usuario, password } = req.body;  // <-- Asegúrate de que los nombres coincidan con Postman
    if (!usuario || !password) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    try {
        const usuarios = await prisma.usuario.findMany();
        if (!usuarios) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }
        if (password !== usuarios[0].password) {  // <-- Comparación simple, solo si las contraseñas no están encriptadas
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const token = generateToken({ id: usuarios.id, usuario: usuarios.usuario });
        res.json({ token });
    } catch (error) {
        console.error("Error al autenticar:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


app.use("/api", verifyToken, clientsRoutes, negociosRoutes, rubrosRoutes, subRubrosRoutes, productsRoutes, ventaRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
