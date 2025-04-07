const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/mensajes/obtener
router.get('/obtener', async (req, res) => {
  try {
      const [mensajes] = await db.query(`
          SELECT id, emisor_id, receptor_id, mensaje, fecha_envio 
          FROM mensajes 
          ORDER BY fecha_envio ASC
      `);
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


// POST /api/mensajes/enviar
router.post('/enviar', async (req, res) => {
 const { emisor_id, receptor_id, mensaje } = req.body;

 if (!emisor_id || !receptor_id || !mensaje) {
     return res.status(400).json({ error: 'Faltan campos requeridos' });
 }

 try {
     const fecha_envio = new Date(); // fecha actual en ISO
     await db.query(`
         INSERT INTO mensajes (emisor_id, receptor_id, mensaje, fecha_envio)
         VALUES (?, ?, ?, ?)
     `, [emisor_id, receptor_id, mensaje, fecha_envio]);

     res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
 } catch (error) {
     console.error('Error al enviar mensaje:', error);
     res.status(500).json({ error: 'Error al enviar mensaje' });
 }
});


module.exports = router;
