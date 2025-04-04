const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// Registrar nuevo usuario
router.post('/registrar', (req, res) => {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (results.length > 0) return res.status(409).json({ error: 'Correo ya registrado' });

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: 'Error al encriptar contraseña' });

            db.query(
                'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
                [nombre, correo, hash],
                (err, result) => {
                    if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
                    res.json({ mensaje: 'Usuario registrado correctamente', id: result.insertId });
                }
            );
        });
    });
});

// Listar todos los usuarios
router.get('/', (req, res) => {
    db.query('SELECT id, nombre, correo FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
        res.json(results);
    });
});

module.exports = router;