const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { user, password } = req.body;

    try {
        const [results] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [user]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];

        const coinciden = await bcrypt.compare(password, usuario.password);
        if (!coinciden) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                usuario: usuario.usuario
            }
        });
    } catch (error) {
        console.error('❌ Error en login:', error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
