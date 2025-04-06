const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { user, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE usuario = ?', [user], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const usuario = results[0];

        bcrypt.compare(password, usuario.password, (err, coinciden) => {
            if (!coinciden) return res.status(401).json({ error: 'Contraseña incorrecta' });

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
        });
    });
});

module.exports = router;