const express = require("express");
require("dotenv").config();
const { generateToken, verifyToken } = require("./auth");
const { getUserByUsername } = require("./db");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT;


//ROUTES
const clientsRoutes = require("./routes/routesClientes");
const negociosRoutes = require("./routes/negocioRoutes");




app.use(express.json());

// Ruta de login para generar un token
app.post("/login", async (req, res) => {
    const { usuario, password } = req.body;  // <-- Asegúrate de que los nombres coincidan con Postman
    if (!usuario || !password) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    try {
        const user = await getUserByUsername(usuario);  // <-- Pasa "usuario", no "username"
        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        if (password !== user.password) {  // <-- Comparación simple, solo si las contraseñas no están encriptadas
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const token = generateToken({ id: user.id, usuario: user.usuario });
        res.json({ token });
    } catch (error) {
        console.error("Error al autenticar:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


app.use("/api", verifyToken, clientsRoutes, negociosRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
