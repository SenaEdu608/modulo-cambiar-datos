// routes/usuarios.routes.js
const express = require("express");
const router = express.Router();

// Importar solo los controladores necesarios
const { actualizarDatosUsuario } = require("../controllers/actualizarDatos.controller");
const { obtenerPerfilCliente } = require("../controllers/perfil.controller");

// Rutas básicas para el módulo de cambiar datos
router.put("/actualizar-datos", actualizarDatosUsuario);
router.get("/obtener-datos", obtenerPerfilCliente);

module.exports = router;