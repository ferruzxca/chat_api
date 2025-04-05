// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Rutas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const mensajeRoutes = require('./routes/mensajes');
const historialRoutes = require('./routes/historial');


const app = express();

// Render ignora esta variable, pero la necesitamos para local
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite acceso desde Android y frontend
app.use(express.json()); // Permite recibir JSON en requests

// Endpoints base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/historial', historialRoutes);

// Ruta raíz opcional
app.get('/', (req, res) => {
    res.send('API REST Chat activa y funcionando.');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en el puerto ${PORT}`);
});
