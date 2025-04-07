// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middleware general
app.use(cors()); // Permitir acceso desde apps móviles o frontends
app.use(express.json()); // Parsear JSON automáticamente
app.use(express.urlencoded({ extended: true })); // Para formularios

// Rutas importadas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const mensajeRoutes = require('./routes/mensajes');
const historialRoutes = require('./routes/historial');

// Rutas base organizadas por módulo
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/historial', historialRoutes);

// Ruta raíz para ver si la API está viva
app.get('/', (req, res) => {
    res.status(200).send('✅ API REST de Chat activa y funcionando.');
});

// Puerto local o asignado por Render
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
