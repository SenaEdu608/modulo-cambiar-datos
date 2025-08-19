// controllers/perfil.controller.js
const pool = require("../db/conexion");

// ID fijo para pruebas 
const USUARIO_PRUEBA_ID = 1;

const obtenerPerfilCliente = async (req, res) => {
  try {
    const [usuario] = await pool.execute(
      "SELECT id, nombre, correo FROM usuarios WHERE id = ?",
      [USUARIO_PRUEBA_ID]
    );

    const [infoCliente] = await pool.execute(
      "SELECT telefono, direccion FROM informacion_cliente WHERE usuario_id = ?",
      [USUARIO_PRUEBA_ID]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado." 
      });
    }

    res.status(200).json({
      success: true,
      datos: {
        id: USUARIO_PRUEBA_ID, // Asegurar que siempre se envíe el ID
        nombre: usuario[0].nombre,
        correo: usuario[0].correo,
        telefono: infoCliente[0]?.telefono || "",
        direccion: infoCliente[0]?.direccion || ""
      }
    });

  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener los datos del perfil." 
    });
  }
};


module.exports = { obtenerPerfilCliente };