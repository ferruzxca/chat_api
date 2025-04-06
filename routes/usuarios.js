const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// Registrar nuevo usuario
router.post('/registrar', (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, correo, password } = req.body;

    // Validación de campos vacíos
    if (!nombre || !apellido_paterno || !apellido_materno || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Generar nombre de usuario
    function obtenerPrefijo(texto) {
        return texto.charAt(0).toUpperCase() + (texto.charAt(1)?.toLowerCase() || '');
    }

    const usuario = obtenerPrefijo(nombre) + obtenerPrefijo(apellido_paterno) + obtenerPrefijo(apellido_materno);

    // Verificar si el correo o usuario ya existen
    db.query('SELECT * FROM usuarios WHERE correo = ? OR usuario = ?', [correo, usuario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (results.length > 0) return res.status(409).json({ error: 'Correo o nombre de usuario ya registrados' });

        // Encriptar contraseña y registrar
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: 'Error al encriptar la contraseña' });

            db.query(
                'INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, usuario, correo, password) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, apellido_paterno, apellido_materno, usuario, correo, hash],
                (err, result) => {
                    if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
                    res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario, id: result.insertId });
                }
            );
        });
    });
});