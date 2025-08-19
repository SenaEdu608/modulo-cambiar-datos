-- Creación de la nueva base de datos
CREATE DATABASE IF NOT EXISTS `modulo-cambiar-datos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `modulo-cambiar-datos`;

-- Tabla usuarios (simplificada solo con lo necesario)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla informacion_cliente (simplificada)
CREATE TABLE IF NOT EXISTS `informacion_cliente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `informacion_cliente_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
