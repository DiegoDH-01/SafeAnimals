// routes/estadoServicio.routes.js
const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoServicio.controller');

router.get('/', estadoController.listarEstados);
router.get('/:id', estadoController.obtenerPorId); // 🔹 Ruta para buscar por ID

module.exports = router;
