const express = require('express');
const router = express.Router();

const duenoController = require('../controllers/dueno.Controller');
const auth = require('../middleware/auth'); // ✅ Importar middleware de autenticación

// Crear nuevo dueño (requiere usuario autenticado)
router.post('/registro', auth, duenoController.registrar);

// Obtener todos los dueños activos (consulta pública o protegida si decides)
router.get('/', duenoController.obtenerTodos);

// Obtener dueño por ID (si está activo)
router.get('/:id', duenoController.obtenerPorId);

// Actualizar dueño (requiere autenticación)
router.put('/:id', auth, duenoController.actualizar);

// Eliminación lógica del dueño (requiere autenticación)
router.delete('/:id', auth, duenoController.eliminar);

module.exports = router;
