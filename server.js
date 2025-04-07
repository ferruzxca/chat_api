// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middleware global
app.use(cors()); // Permitir conexiones desde apps móviles / frontend
app.use(express.json()); // Parseo automático de JSON
app.use(express.urlencoded({ extended: true })); // Parseo de formularios

// Importar rutas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const mensajeRoutes = require('./routes/mensajes');
const historialRoutes = require('./routes/historial');
const healthRoutes = require('./routes/health');


// Asignar rutas base
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/health', healthRoutes);


// Ruta raíz (opcional para comprobar si está activa)
app.get('/', (req, res) => {
    res.status(200).send('✅ API activa y funcionando.');
});

// Puerto de ejecución (local o Render)
const PORT = process.env.PORT || 3000;

// Verificar conexión a la base de datos antes de iniciar
db.getConnection()
    .then(connection => {
        console.log('✅ Conectado correctamente a la base de datos MySQL.');
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        process.exit(1); // Detener el servidor si no hay conexión
    });
