const express = require('express');
const router = express.Router();

const mascotaController = require('../controllers/mascota.Controller');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth'); // ✅ Importar middleware

// Crear nueva mascota (requiere autenticación)
router.post('/registro', auth, upload.single('foto'), mascotaController.registrar);

// Obtener todas las mascotas activas (pública o protegida según lo necesites)
router.get('/', mascotaController.obtenerTodos);

// Obtener una mascota por ID
router.get('/:id', mascotaController.obtenerPorId);

// Actualizar datos de una mascota (requiere autenticación)
router.put('/:id', auth, upload.single('foto'), mascotaController.actualizar);

// Verificar dueño (requiere autenticación)
router.put('/:id/verificar', auth, mascotaController.verificarDueno);

// Eliminación lógica de una mascota (requiere autenticación)
router.delete('/:id', auth, mascotaController.eliminar);

module.exports = router;
