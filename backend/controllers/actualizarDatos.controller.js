// controllers/actualizarDatos.controller.js
const pool = require("../db/conexion");
const bcrypt = require('bcrypt');

// ID fijo para pruebas 
const USUARIO_PRUEBA_ID = 1;

const actualizarDatosUsuario = async (req, res) => {
  const { telefono, direccion, correo, nombre, nuevaContrasena, confirmarContrasena } = req.body;

  // Validaciones básicas
  if (!telefono || !direccion || !correo || !nombre) {
    return res.status(400).json({ 
      success: false, 
      message: "Todos los campos son obligatorios." 
    });
  }

  // Validación de contraseña si se está cambiando
  if (nuevaContrasena) {
    if (nuevaContrasena.length < 8) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres."
      });
    }
    if (!/[A-Z]/.test(nuevaContrasena)) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe contener al menos una mayúscula."
      });
    }
    if (!/\d/.test(nuevaContrasena)) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe contener al menos un número."
      });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(nuevaContrasena)) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe contener al menos un carácter especial."
      });
    }
    if (nuevaContrasena !== confirmarContrasena) {
      return res.status(400).json({
        success: false,
        message: "Las contraseñas no coinciden."
      });
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Actualizar usuario
    await conn.execute(
      "UPDATE usuarios SET correo = ?, nombre = ? WHERE id = ?",
      [correo, nombre, USUARIO_PRUEBA_ID]
    );

    // Actualizar información del cliente
    await conn.execute(
      "UPDATE informacion_cliente SET telefono = ?, direccion = ? WHERE usuario_id = ?",
      [telefono, direccion, USUARIO_PRUEBA_ID]
    );

    // Actualizar contraseña si se proporcionó
    if (nuevaContrasena) {
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
      await conn.execute(
        "UPDATE usuarios SET contrasena = ? WHERE id = ?",
        [hashedPassword, USUARIO_PRUEBA_ID]
      );
    }

    await conn.commit();

    res.status(200).json({
      success: true,
      message: "Datos actualizados correctamente.",
      datos: { 
        id: USUARIO_PRUEBA_ID,
        nombre, 
        correo, 
        telefono, 
        direccion 
      }
    });

  } catch (error) {
    await conn.rollback();
    console.error("Error al actualizar datos:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar los datos." 
    });
  } finally {
    conn.release();
  }
};

module.exports = { actualizarDatosUsuario };