-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql:3306
-- Tiempo de generación: 01-08-2025 a las 23:22:46
-- Versión del servidor: 8.0.42
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `safe_animals_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dueno`
--

CREATE TABLE `dueno` (
  `idDueno` int NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `celular` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dueno`
--

INSERT INTO `dueno` (`idDueno`, `nombres`, `apellidos`, `celular`, `email`, `created_at`, `updated_at`, `activo`) VALUES
(1, 'Juan Carlos CLi', 'Pérez Martínez', '0991234567', 'juan.perez@exdasample.com', '2025-07-29 15:05:36', '2025-08-01 21:21:24', 1),
(2, 'Juan Carlos CLi', 'Pérez Martínez', '0991234567', 'juan.perez@example.com', '2025-07-29 15:06:25', '2025-07-31 13:24:37', 0),
(3, 'DIEGO', 'STEVEN', '0959544333', 'diegos11hh582@gmail.com', '2025-07-29 15:38:48', '2025-07-30 00:15:11', 0),
(4, 'DIEGO', 'STEVEN', '095954433', 'diegoshhw582@gmail.com', '2025-07-30 01:29:20', '2025-07-31 13:24:21', 0),
(5, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@example.com', '2025-07-30 01:45:23', '2025-07-30 01:45:23', 1),
(6, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exampSle.com', '2025-07-30 01:45:30', '2025-07-30 01:45:30', 1),
(7, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSampSle.com', '2025-07-30 01:45:32', '2025-07-30 01:45:32', 1),
(8, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSampSlAe.com', '2025-07-30 01:45:36', '2025-07-30 01:45:36', 1),
(9, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSaDpSlAe.com', '2025-07-30 01:45:38', '2025-07-30 01:45:38', 1),
(10, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSaSDpSlAe.com', '2025-07-30 01:45:40', '2025-07-30 01:45:40', 1),
(11, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSaSDDpSlAe.com', '2025-07-30 01:45:42', '2025-07-30 01:45:42', 1),
(12, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSaSDDpSAlAe.com', '2025-07-30 01:45:44', '2025-07-30 01:45:44', 1),
(13, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSaSDDpSAlAeA.com', '2025-07-30 01:45:47', '2025-07-30 01:48:44', 0),
(14, 'Pedro Pablo', 'Pérez Martínez', '0991234567', 'juanp.perez@exSaSDDpSAlAeAA.com', '2025-07-30 01:45:49', '2025-07-30 01:48:42', 0),
(15, 'eRIK', 'STEVEN', '22', 'diegoshh5S82@gmail.com', '2025-07-30 01:49:19', '2025-07-30 01:49:19', 1),
(16, 'DIEGO', 'STEVEN', '0123456789', 'diegoshssh582@gmail.com', '2025-08-01 17:42:55', '2025-08-01 17:43:08', 0),
(17, 'DIEGO', 'STEVEN', '0959544333', 'diegoshh582@gmail.com', '2025-08-01 17:56:31', '2025-08-01 17:56:31', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadoservicio`
--

CREATE TABLE `estadoservicio` (
  `idEstado` int NOT NULL,
  `nombreEstado` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estadoservicio`
--

INSERT INTO `estadoservicio` (`idEstado`, `nombreEstado`, `descripcion`, `created_at`) VALUES
(1, 'Recibido', 'Mascota ha llegado a la peluquería', '2025-08-01 15:56:47'),
(2, 'En proceso', 'Servicio en curso', '2025-08-01 15:56:47'),
(3, 'Finalizado', 'Servicio completado y listo para ser retirado', '2025-08-01 15:56:47'),
(4, 'Entregado', 'La mascota ha sido entregada a su dueño', '2025-08-01 17:11:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `idHistorial` int NOT NULL,
  `idServicio` int NOT NULL,
  `idEstadoAnterior` int NOT NULL,
  `idEstadoNuevo` int NOT NULL,
  `fechaCambio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observacion` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `idMascota` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `raza` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `idDueno` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`idMascota`, `nombre`, `raza`, `foto`, `idDueno`, `created_at`, `updated_at`, `activo`) VALUES
(1, 'Firulais', 'Labrador', 'nombre.jpg', 4, '2025-07-31 12:58:32', '2025-07-31 13:30:00', 1),
(2, 'Firulais', 'Labrador', 'nombre.jpg', 1, '2025-07-31 13:18:34', '2025-07-31 13:18:34', 1),
(3, 'Rufo', 'Salchichita', 'nombre.jpg', 1, '2025-08-01 18:35:30', '2025-08-01 18:35:30', 1),
(4, 'Maya', 'Golden Retr', 'nombre.jpg', 1, '2025-08-01 19:50:25', '2025-08-01 19:50:25', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `idNotificacion` int NOT NULL,
  `idServicio` int NOT NULL,
  `mensaje` text COLLATE utf8mb4_general_ci NOT NULL,
  `medio` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'WhatsApp',
  `fechaEnvio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`idNotificacion`, `idServicio`, `mensaje`, `medio`, `fechaEnvio`) VALUES
(1, 8, 'El servicio de tu mascota ha finalizado. Puedes pasar a retirarla.', 'WhatsApp', '2025-08-01 22:11:07'),
(2, 1, 'El servicio de tu mascota ha finalizado. Puedes pasar a retirarla.', 'WhatsApp', '2025-08-01 22:13:15'),
(3, 2, 'El servicio de tu mascota ha finalizado. Puedes pasar a retirarla.', 'WhatsApp', '2025-08-01 22:44:49'),
(4, 4, 'El servicio de tu mascota ha finalizado. Puedes pasar a retirarla.', 'WhatsApp', '2025-08-01 23:14:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `idServicio` int NOT NULL,
  `fechaRegistro` date NOT NULL,
  `fechaFinalizacion` date DEFAULT NULL,
  `referencia` text COLLATE utf8mb4_general_ci,
  `idMascota` int NOT NULL,
  `idUsuario` int NOT NULL,
  `idEstadoActual` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activo` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`idServicio`, `fechaRegistro`, `fechaFinalizacion`, `referencia`, `idMascota`, `idUsuario`, `idEstadoActual`, `created_at`, `updated_at`, `activo`) VALUES
(1, '2025-08-01', '2025-08-01', 'Baño, secado y corte', 1, 4, 3, '2025-08-01 16:36:27', '2025-08-01 22:53:03', 1),
(2, '2025-08-01', '2025-08-01', 'Baño y corte', 1, 2, 4, '2025-08-01 16:45:22', '2025-08-01 17:17:18', 1),
(3, '2025-08-01', NULL, 'Perinado con AdadaDseite de coco', 3, 4, 1, '2025-08-01 19:33:08', '2025-08-01 20:00:03', 0),
(4, '2025-08-01', '2025-08-01', 'Peinado locochon', 4, 4, 4, '2025-08-01 19:59:44', '2025-08-01 21:10:19', 1),
(5, '2025-08-01', NULL, 'dad', 3, 4, 1, '2025-08-01 20:00:46', '2025-08-01 20:41:36', 0),
(6, '2025-08-02', '2025-08-01', 'adadfs', 3, 4, 4, '2025-08-01 20:05:43', '2025-08-01 21:08:23', 1),
(7, '2025-08-02', '2025-08-01', 'aDA', 4, 4, 4, '2025-08-01 20:41:49', '2025-08-01 20:55:45', 1),
(8, '2025-08-01', '2025-08-01', 'aedsd', 3, 4, 4, '2025-08-01 21:25:57', '2025-08-01 22:53:36', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','RECEPCIONISTA') NOT NULL DEFAULT 'RECEPCIONISTA',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nombres`, `apellidos`, `email`, `password`, `rol`, `created_at`) VALUES
(1, 'Erika', 'Pérez', 'erika@safe.com', '$2b$10$vL0SghY3g78.xAQ5D5f0kOQDou2MFHzEjKzBoj7ZLMxQFq2ZwJrmq', 'RECEPCIONISTA', '2025-07-22 00:57:09'),
(2, 'Erika', 'Pérez', 'erika@sasfe.com', '$2b$10$vl5RCpcZuFV4Q47xJOTKmetq3qPlxw8NDTaYsDMUN0AYV3/5YCcgC', 'RECEPCIONISTA', '2025-07-22 01:17:21'),
(3, 'Erika', 'Pérez', 'erika@sasfdde.com', '$2b$10$pXbl/KYN2VwJhKq6L4TUS.g6d/.MMFhiFTOtSJino5uRfRp0WzhHO', 'RECEPCIONISTA', '2025-07-26 15:21:41'),
(4, 'Diego', 'Hidalgo', 'diegoshh582@gmail.com', '$2b$10$zLT97s5wULfGHJGGrkelJuUOqqJZGGqaamrGacjtkyNiC/NX7Btgy', 'RECEPCIONISTA', '2025-07-26 18:37:31');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dueno`
--
ALTER TABLE `dueno`
  ADD PRIMARY KEY (`idDueno`);

--
-- Indices de la tabla `estadoservicio`
--
ALTER TABLE `estadoservicio`
  ADD PRIMARY KEY (`idEstado`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`idHistorial`),
  ADD KEY `idServicio` (`idServicio`),
  ADD KEY `idEstadoAnterior` (`idEstadoAnterior`),
  ADD KEY `idEstadoNuevo` (`idEstadoNuevo`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`idMascota`),
  ADD KEY `idDueno` (`idDueno`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`idNotificacion`),
  ADD KEY `idServicio` (`idServicio`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`idServicio`),
  ADD KEY `idMascota` (`idMascota`),
  ADD KEY `idRecepcionista` (`idUsuario`),
  ADD KEY `idEstadoActual` (`idEstadoActual`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dueno`
--
ALTER TABLE `dueno`
  MODIFY `idDueno` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `estadoservicio`
--
ALTER TABLE `estadoservicio`
  MODIFY `idEstado` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `historial`
--
ALTER TABLE `historial`
  MODIFY `idHistorial` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `idMascota` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `idNotificacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `idServicio` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `historial`
--
ALTER TABLE `historial`
  ADD CONSTRAINT `historial_ibfk_1` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`idServicio`),
  ADD CONSTRAINT `historial_ibfk_2` FOREIGN KEY (`idEstadoAnterior`) REFERENCES `estadoservicio` (`idEstado`),
  ADD CONSTRAINT `historial_ibfk_3` FOREIGN KEY (`idEstadoNuevo`) REFERENCES `estadoservicio` (`idEstado`);

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`idDueno`) REFERENCES `dueno` (`idDueno`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`idServicio`);

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `servicio_ibfk_1` FOREIGN KEY (`idMascota`) REFERENCES `mascota` (`idMascota`),
  ADD CONSTRAINT `servicio_ibfk_3` FOREIGN KEY (`idEstadoActual`) REFERENCES `estadoservicio` (`idEstado`),
  ADD CONSTRAINT `servicio_usuario_fk` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
