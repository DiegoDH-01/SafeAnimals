const notificacionService = require('../services/notificacion.Service');

/**
 * POST /api/notificaciones
 * Registrar una nueva notificación
 */
async function crear(req, res) {
  try {
    const notificacion = await notificacionService.registrarNotificacion(req.body);
    res.status(201).json(notificacion);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

/**
 * GET /api/notificaciones
 * Obtener todas las notificaciones (opcional)
 */
async function listarTodas(req, res) {
  try {
    const notificaciones = await notificacionService.obtenerTodas();
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener notificaciones', error: error.message });
  }
}

module.exports = {
  crear,
  listarTodas
};
