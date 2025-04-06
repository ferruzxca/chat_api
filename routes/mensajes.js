const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /mensajes/obtener
router.get('/obtener', async (req, res) => {
    try {
        const [mensajes] = await db.query("SELECT id, emisor_id, receptor_id, mensaje, fecha_envio FROM mensajes ORDER BY fecha_envio ASC");

        // Convierte fechas a ISO 8601
        const mensajesFormateados = mensajes.map(m => ({
            ...m,
            fecha_envio: new Date(m.fecha_envio).toISOString()
        }));

        res.json(mensajesFormateados);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});

module.exports = router;