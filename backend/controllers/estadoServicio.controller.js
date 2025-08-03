const estadoService = require('../services/estadoServicio.service');

/**
 * GET /api/estadoservicio
 */
async function listarEstados(req, res) {
  try {
    const estados = await estadoService.obtenerTodosLosEstados();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los estados', error: error.message });
  }
}

/**
 * GET /api/estadoservicio/:id
 */
async function obtenerPorId(req, res) {
  try {
    const id = req.params.id;
    const estado = await estadoService.obtenerEstadoPorId(id);
    res.json(estado);
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
}

module.exports = {
  listarEstados,
  obtenerPorId
};
