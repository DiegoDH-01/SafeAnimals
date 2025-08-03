const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacion.Controller');

// Registrar una nueva notificación
router.post('/', notificacionController.crear);

// Obtener todas las notificaciones (opcional)
router.get('/', notificacionController.listarTodas);

module.exports = router;
