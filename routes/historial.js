const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/historial/:emisorId/:receptorId
router.get('/:emisorId/:receptorId', (req, res) => {
  const { emisorId, receptorId } = req.params;

  const sql = `
    SELECT 
      DATE_FORMAT(m.fecha_envio, '[%d/%m/%y, %l:%i:%s %p]') AS fecha_formateada,
      u.nombre AS nombre_emisor,
      m.mensaje
    FROM mensajes m
    JOIN usuarios u ON m.emisor_id = u.id
    WHERE 
      (m.emisor_id = ? AND m.receptor_id = ?)
      OR
      (m.emisor_id = ? AND m.receptor_id = ?)
    ORDER BY m.fecha_envio ASC
  `;

  db.query(sql, [emisorId, receptorId, receptorId, emisorId], (err, results) => {
    if (err) {
      console.error("Error al obtener historial:", err);
      return res.status(500).json({ error: "Error al obtener historial" });
    }

    const historialFormateado = results.map(m => `${m.fecha_formateada} ${m.nombre_emisor}: ${m.mensaje}`);
    res.json({ historial: historialFormateado });
  });
});

module.exports = router;
