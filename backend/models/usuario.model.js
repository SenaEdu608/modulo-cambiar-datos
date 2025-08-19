const pool = require("../db/conexion");

/**
 * Verifica si un correo electrónico ya está registrado en la base de datos
 * @param {string} correo - Correo electrónico a verificar
 * @returns {boolean} - True si el correo existe, false si no existe
 * @throws {Error} - Si ocurre un error en la consulta
 */
async function correoExiste(correo) {
  try {
    const [rows] = await pool.execute(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correo]
    );
    return rows.length > 0;
  } catch (error) {
    console.error("Error al verificar si el correo existe:", error);
    throw new Error("Error al consultar el correo.");
  }
}

/**
 * Inserta un nuevo usuario en la base de datos y crea su registro de información
 * @param {string} nombre - Nombre del usuario
 * @param {string} correo - Correo electrónico del usuario
 * @param {string} contrasenaHasheada - Contraseña hasheada del usuario
 * @returns {number} - ID del usuario insertado
 * @throws {Error} - Si ocurre un error durante la inserción
 */
async function insertarUsuario(nombre, correo, contrasenaHasheada) {
  let conn;
  try {
    // Obtiene una conexión del pool y comienza una transacción
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Inserta el usuario en la tabla usuarios
    const [resultado] = await conn.execute(
      "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)",
      [nombre, correo, contrasenaHasheada]
    );

    const usuarioId = resultado.insertId;

    // Crea un registro relacionado en la tabla informacionCliente
    await conn.execute(
      "INSERT INTO informacionCliente (usuario_id) VALUES (?)",
      [usuarioId]
    );

    // Confirma la transacción si todo fue exitoso
    await conn.commit();
    return usuarioId;
  } catch (error) {
    // Revierte la transacción en caso de error
    if (conn) await conn.rollback();
    console.error("Error al insertar el usuario:", error);
    throw new Error("No se pudo registrar el usuario.");
  } finally {
    // Libera la conexión de vuelta al pool
    if (conn) conn.release();
  }
}

/**
 * Inserta un token de confirmación de correo para un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {string} token - Token de confirmación
 * @throws {Error} - Si ocurre un error al insertar el token
 */
async function insertarConfirmacionCorreo(usuarioId, token) {
  try {
    await pool.execute(
      "INSERT INTO confirmarCorreo (usuario_id, token_confimar) VALUES (?, ?)",
      [usuarioId, token]
    );
  } catch (error) {
    console.error("Error al insertar token de confirmación:", error);
    throw new Error("No se pudo registrar el token de confirmación.");
  }
}

module.exports = {
  correoExiste,
  insertarUsuario,
  insertarConfirmacionCorreo
};