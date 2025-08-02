const servicioService = require('../services/servicio.Service');

/**
 * POST /api/servicios
 * Registrar un nuevo servicio
 */
async function registrar(req, res) {
  try {
    const nuevoServicio = await servicioService.registrarServicio(req.body);
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

/**
 * GET /api/servicios
 * Obtener todos los servicios
 */
async function listarTodos(req, res) {
  try {
    const servicios = await servicioService.obtenerTodos();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los servicios', error: error.message });
  }
}

/**
 * GET /api/servicios/:id
 * Obtener servicio por ID
 */
async function obtenerPorId(req, res) {
  try {
    const id = req.params.id;
    const servicio = await servicioService.obtenerPorId(id);
    res.json(servicio);
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
}

/**
 * PUT /api/servicios/:id
 * Actualizar datos generales del servicio
 */
async function actualizar(req, res) {
  try {
    const id = req.params.id;
    const servicioActualizado = await servicioService.actualizarDatosServicio(id, req.body);
    res.json({ mensaje: 'Servicio actualizado correctamente', servicio: servicioActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

/**
 * PUT /api/servicios/:id/cambiar-estado
 * Cambiar el estado manualmente pasando ID del estado nuevo
 */
async function cambiarEstado(req, res) {
  try {
    const id = req.params.id;
    const { nuevoEstadoId } = req.body;
    const actualizado = await servicioService.actualizarEstado(id, nuevoEstadoId);
    res.json({ mensaje: 'Estado actualizado correctamente', servicio: actualizado });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

/**
 * PUT /api/servicios/:id/avanzar-estado
 * Avanzar automáticamente al siguiente estado
 */
async function avanzarEstado(req, res) {
  try {
    const id = req.params.id;
    const actualizado = await servicioService.avanzarEstado(id);
    res.json({ mensaje: 'Estado avanzado correctamente', servicio: actualizado });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

/**
 * PUT /api/servicios/:id/retroceder-estado
 * Volver automáticamente al estado anterior
 */
async function retrocederEstado(req, res) {
  try {
    const id = req.params.id;
    const actualizado = await servicioService.retrocederEstado(id);
    res.json({ mensaje: 'Estado retrocedido correctamente', servicio: actualizado });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

/**
 * DELETE /api/servicios/:id
 * Eliminar servicio (borrado lógico)
 */
async function eliminar(req, res) {
  try {
    const id = req.params.id;
    const resultado = await servicioService.eliminarServicio(id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

module.exports = {
  registrar,
  listarTodos,
  obtenerPorId,
  actualizar,
  cambiarEstado,
  avanzarEstado,
  retrocederEstado,
  eliminar
};
