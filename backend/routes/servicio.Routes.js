const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicio.Controller');


router.get('/historial', servicioController.obtenerTodosLosServicios);

// Crear un nuevo servicio (agendar cita)
router.post('/', servicioController.registrar);

// Listar todos los servicios
router.get('/', servicioController.listarTodos);
// Listar servicios que ya fueron entregados
router.get('/entregados', servicioController.listarEntregados);




// Obtener un servicio por ID
router.get('/:id', servicioController.obtenerPorId);

// Cambiar el estado de un servicio
router.put('/:id/cambiar-estado', servicioController.cambiarEstado);

// Eliminar un servicio (borrado lógico)
router.delete('/:id', servicioController.eliminar);

router.put('/:id', servicioController.actualizar);
router.put('/:id/avanzar-estado', servicioController.avanzarEstado);
router.put('/:id/retroceder-estado', servicioController.retrocederEstado);

module.exports = router;
