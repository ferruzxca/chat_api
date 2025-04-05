// routes/historial.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Ruta: /historial
router.get("/", async (req, res) => {
  try {
    const [mensajes] = await db.promise().query(`
        SELECT 
      DATE_FORMAT(m.fecha_envio, '[%d/%m/%y, %l:%i:%s %p]') AS fecha_formateada,
      u.nombre AS emisor_nombre,
      m.mensaje
  FROM mensajes m
  JOIN usuarios u ON m.emisor_id = u.id
  WHERE (m.emisor_id = ? AND m.receptor_id = ?) 
     OR (m.emisor_id = ? AND m.receptor_id = ?)
  ORDER BY m.fecha_envio ASC`);

    res.json(mensajes);
  } catch (err) {
    console.error("ERROR EN /historial:", err); // Mensaje más claro
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
