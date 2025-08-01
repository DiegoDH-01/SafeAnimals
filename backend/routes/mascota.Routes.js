const express = require('express');
const router = express.Router();

const mascotaController = require('../controllers/mascota.Controller');

// Crear nueva mascota
router.post('/registro', mascotaController.registrar);

// Obtener todas las mascotas activas (incluye datos del dueño)
router.get('/', mascotaController.obtenerTodos);

// Obtener una mascota por ID (solo si está activa)
router.get('/:id', mascotaController.obtenerPorId);

// Actualizar datos de una mascota
router.put('/:id', mascotaController.actualizar);

// Eliminación lógica de una mascota
router.delete('/:id', mascotaController.eliminar);

module.exports = router;
