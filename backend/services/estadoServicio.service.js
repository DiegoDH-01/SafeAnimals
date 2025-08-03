const { EstadoServicio } = require('../models');

/**
 * Obtener todos los estados
 */
async function obtenerTodosLosEstados() {
  return await EstadoServicio.findAll({
    attributes: ['idEstado', 'nombreEstado', 'descripcion']
  });
}

/**
 * Obtener un estado por su ID
 */
async function obtenerEstadoPorId(idEstado) {
  const estado = await EstadoServicio.findByPk(idEstado);
  if (!estado) throw new Error('Estado no encontrado');
  return estado;
}

module.exports = {
  obtenerTodosLosEstados,
  obtenerEstadoPorId
};
