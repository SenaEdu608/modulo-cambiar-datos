// backend/app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Ajusta según tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Archivos estáticos del frontend (solo lo necesario)
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/link-barra-tareas-html', express.static(path.join(__dirname, '..', 'frontend', 'html', 'link-barra-tareas-html')));

// Importar y usar rutas de usuarios (solo las necesarias para cambiar datos)
const usuariosRoutes = require("./routes/usuarios.routes");
app.use("/api/usuarios", usuariosRoutes);

// Ruta de bienvenido (sin autenticación)
app.get("/bienvenido", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "html", "bienvenido.html"));
});

// Ruta raíz (redirige a bienvenido para pruebas)
app.get('/', (req, res) => {
  res.redirect('/bienvenido');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});