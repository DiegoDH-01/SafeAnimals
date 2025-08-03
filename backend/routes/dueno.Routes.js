const express = require('express');
const router = express.Router();

const duenoController = require('../controllers/dueno.Controller');

// Crear nuevo dueño
router.post('/registro', duenoController.registrar);

// Obtener todos los dueños activos
router.get('/', duenoController.obtenerTodos);

// Obtener dueño por ID (si está activo)
router.get('/:id', duenoController.obtenerPorId);

// Actualizar dueño
router.put('/:id', duenoController.actualizar);

// Borrado lógico
router.delete('/:id', duenoController.eliminar);

module.exports = router;
