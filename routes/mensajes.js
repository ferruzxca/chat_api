const express = require('express');
const router = express.Router();
const db = require('../db');

// Enviar un mensaje
router.post('/', (req, res) => {
    const { emisor_id, receptor_id, mensaje } = req.body;

    if (!emisor_id || !receptor_id || !mensaje) {
        return res.status(400).json({ error: 'Faltan datos para enviar el mensaje' });
    }

    db.query(
        'INSERT INTO mensajes (emisor_id, receptor_id, mensaje) VALUES (?, ?, ?)',
        [emisor_id, receptor_id, mensaje],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al guardar mensaje' });
            res.json({ mensaje: 'Mensaje enviado', id: result.insertId });
        }
    );
});

// Obtener mensajes entre dos usuarios
router.get('/:usuario1/:usuario2', (req, res) => {
    const { usuario1, usuario2 } = req.params;

    db.query(
        `SELECT * FROM mensajes
         WHERE (emisor_id = ? AND receptor_id = ?)
            OR (emisor_id = ? AND receptor_id = ?)
         ORDER BY fecha_envio ASC`,
        [usuario1, usuario2, usuario2, usuario1],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener mensajes' });
            res.json(results);
        }
    );
});

module.exports = router;