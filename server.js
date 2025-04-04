const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Rutas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const mensajeRoutes = require('./routes/mensajes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // muy importante para que Android pueda acceder
app.use(express.json());

// Endpoints base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mensajes', mensajeRoutes);

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en el puerto ${PORT}`);
});