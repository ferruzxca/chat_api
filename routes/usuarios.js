const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// Registrar nuevo usuario
router.post("/registrar", async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, correo, password } =
    req.body;

  if (
    !nombre ||
    !apellido_paterno ||
    !apellido_materno ||
    !correo ||
    !password
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const correoRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!correoRegex.test(correo)) {
    return res.status(400).json({ error: "Correo electrónico no válido" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  function obtenerPrefijo(texto) {
    return (
      texto.charAt(0).toUpperCase() + (texto.charAt(1)?.toLowerCase() || "")
    );
  }

  const usuario =
    obtenerPrefijo(nombre) +
    obtenerPrefijo(apellido_paterno) +
    obtenerPrefijo(apellido_materno);

  try {
    const [existe] = await db.query(
      "SELECT * FROM usuarios WHERE correo = ? OR usuario = ?",
      [correo, usuario]
    );

    if (existe.length > 0) {
      return res
        .status(409)
        .json({ error: "Correo o nombre de usuario ya registrados" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, usuario, correo, password) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido_paterno, apellido_materno, usuario, correo, hash]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario,
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error en /registrar:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
