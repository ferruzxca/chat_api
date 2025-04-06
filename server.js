// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const app = express();

// Rutas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const mensajeRoutes = require('./routes/mensajes');
const historialRoutes = require('./routes/historial');

// Render ignora esta variable, pero la necesitamos para local
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite acceso desde Android y frontend
app.use(express.json()); // Permite recibir JSON en requests
/* The line `app.use(express.urlencoded({ extended: true }));` is setting up a middleware in the
Express application to parse incoming requests with URL-encoded payloads. When a form is submitted
with POST method and enctype set to 'application/x-www-form-urlencoded', the data is sent in the
body of the request in a URL-encoded format. */
app.use(express.urlencoded({ extended: true }));

// Endpoints base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/historial', historialRoutes);

// Ruta raíz opcional
app.get('/', (req, res) => {
    res.send('API REST Chat activa y funcionando.');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en el puerto ${PORT}`);
});
