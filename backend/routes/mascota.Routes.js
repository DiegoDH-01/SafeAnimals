const express = require('express');
const router = express.Router();

const mascotaController = require('../controllers/mascota.Controller');
const upload = require('../middleware/upload'); // <-- NUEVO

// Crear nueva mascota con foto (usando multipart/form-data)
router.post('/registro', upload.single('foto'), mascotaController.registrar);

// Obtener todas las mascotas activas (incluye datos del dueño)
router.get('/', mascotaController.obtenerTodos);

// Obtener una mascota por ID (solo si está activa)
router.get('/:id', mascotaController.obtenerPorId);

// Actualizar datos de una mascota
router.put('/:id', upload.single('foto'), mascotaController.actualizar);

// Eliminación lógica de una mascota
router.delete('/:id', mascotaController.eliminar);

module.exports = router;
