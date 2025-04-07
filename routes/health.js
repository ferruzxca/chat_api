const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/health
router.get('/', async (req, res) => {
    try {
        const [result] = await db.query('SELECT 1 + 1 AS test');
        if (result && result[0].test === 2) {
            res.status(200).json({ status: '✅ API y base de datos funcionando correctamente' });
        } else {
            throw new Error('Resultado inesperado en prueba SQL');
        }
    } catch (error) {
        console.error('❌ Fallo en endpoint /api/health:', error.message);
        res.status(500).json({ status: '❌ Error en la base de datos', error: error.message });
    }
});

module.exports = router;
