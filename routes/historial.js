// routes/historial.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta: /historial
router.get('/historial', async (req, res) => {
  try {
    const [mensajes] = await db.promise().query(`
      SELECT 
        LEAST(emisor_id, receptor_id) AS usuario1,
        GREATEST(emisor_id, receptor_id) AS usuario2,
        MAX(fecha_envio) AS ultima_fecha,
        SUBSTRING_INDEX(GROUP_CONCAT(mensaje ORDER BY fecha_envio DESC), ',', 1) AS ultimo_mensaje
      FROM 
        mensajes
      GROUP BY 
        LEAST(emisor_id, receptor_id), GREATEST(emisor_id, receptor_id)
      ORDER BY 
        ultima_fecha DESC
    `);


    res.json(mensajes);
   } catch (err) {
    console.error("ERROR EN /historial:", err); // Mensaje más claro
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
