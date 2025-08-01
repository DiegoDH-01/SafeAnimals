const { Servicio, Mascota, Usuario, EstadoServicio, Dueno } = require('../models');
const { Op } = require('sequelize');

/**
 * Registrar un nuevo servicio (cita)
 */
async function registrarServicio(data) {
    const { fechaRegistro, referencia, idMascota, idUsuario, idEstadoActual } = data;

    if (!idMascota || !idUsuario || !idEstadoActual || !fechaRegistro) {
        throw new Error('Faltan campos obligatorios');
    }

    const mascota = await Mascota.findOne({ where: { idMascota, activo: true } });
    if (!mascota) throw new Error('Mascota no encontrada o inactiva');

    const servicioDuplicado = await Servicio.findOne({
        where: { idMascota, fechaRegistro, activo: true }
    });

    if (servicioDuplicado) {
        throw new Error('Ya existe un servicio activo para esta mascota en la misma fecha');
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) throw new Error('Usuario no encontrado');

    const estado = await EstadoServicio.findByPk(idEstadoActual);
    if (!estado) throw new Error('Estado del servicio inválido');

    const nuevoServicio = await Servicio.create({
        fechaRegistro,
        referencia,
        idMascota,
        idUsuario,
        idEstadoActual,
        activo: true
    });

    return nuevoServicio;
}


/**
 * Obtener todos los servicios activos (con mascota, estado y usuario)
 */
async function obtenerTodos() {
  return await Servicio.findAll({
    where: { activo: true },
    include: [
      {
        model: Mascota,
        as: 'mascota',
        include: [{ model: require('../models').Dueno, as: 'dueno' }]
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['idUsuario', 'nombres', 'apellidos', 'email', 'rol']
      },
      {
        model: EstadoServicio,
        as: 'estado',
        attributes: ['idEstado', 'nombreEstado'],
        where: {
          nombreEstado: { [Op.ne]: 'Entregado' } // Excluir entregado
        }
      }
    ],
    order: [['created_at', 'DESC']]
  });
}


/**
 * Obtener un servicio activo por ID
 */
async function obtenerPorId(idServicio) {
    const servicio = await Servicio.findOne({
        where: { idServicio, activo: true },
        include: [
            {
                model: Mascota,
                as: 'mascota',
                include: [{ model: Dueno, as: 'dueno' }]
            },
            {
                model: Usuario,
                as: 'usuario',
                attributes: ['idUsuario', 'nombres', 'apellidos', 'email']
            },
            {
                model: EstadoServicio,
                as: 'estado',
                attributes: ['idEstado', 'nombreEstado']
            }
        ]
    });

    if (!servicio) throw new Error('Servicio no encontrado');
    return servicio;
}

/**
 * Actualizar estado del servicio
 */
async function actualizarEstado(idServicio, nuevoEstadoId) {
    const servicio = await Servicio.findOne({ where: { idServicio, activo: true } });
    if (!servicio) throw new Error('Servicio no encontrado');

    const estado = await EstadoServicio.findByPk(nuevoEstadoId);
    if (!estado) throw new Error('Estado de servicio inválido');

    servicio.idEstadoActual = nuevoEstadoId;
    await servicio.save();

    return servicio;
}
/**
 * Actualizar datos de un servicio
 */
async function actualizarDatosServicio(idServicio, data) {
    const servicio = await Servicio.findOne({ where: { idServicio, activo: true } });
    if (!servicio) throw new Error('Servicio no encontrado o inactivo');

    await servicio.update(data);
    return servicio;
}

async function avanzarEstado(idServicio) {
    const servicio = await Servicio.findOne({ where: { idServicio, activo: true } });
    if (!servicio) throw new Error('Servicio no encontrado o inactivo');

    const estadoActual = servicio.idEstadoActual;

    const siguienteEstado = await EstadoServicio.findOne({
        where: { idEstado: estadoActual + 1 }
    });

    if (!siguienteEstado) throw new Error('No se puede avanzar más: ya está en el último estado');

    // Actualizar estado
    servicio.idEstadoActual = siguienteEstado.idEstado;

    // Si es entregado, setear la fechaFinalizacion
    if (siguienteEstado.nombreEstado.toLowerCase() === 'entregado') {
        servicio.fechaFinalizacion = new Date(); // fecha y hora actual
    }
    if (estado.nombreEstado.toLowerCase() === 'entregado') {
        servicio.fechaFinalizacion = new Date();
    }


    await servicio.save();
    return servicio;
}

async function avanzarEstado(idServicio) {
  const servicio = await Servicio.findOne({ where: { idServicio, activo: true } });
  if (!servicio) throw new Error('Servicio no encontrado o inactivo');

  const estadoActual = servicio.idEstadoActual;

  const siguienteEstado = await EstadoServicio.findOne({
    where: { idEstado: estadoActual + 1 }
  });

  if (!siguienteEstado) throw new Error('No se puede avanzar más: ya está en el último estado');

  // Actualizar estado
  servicio.idEstadoActual = siguienteEstado.idEstado;

  // Si es entregado, setear la fechaFinalizacion
  if (siguienteEstado.nombreEstado.toLowerCase() === 'entregado') {
    servicio.fechaFinalizacion = new Date(); // fecha y hora actual
  }

  await servicio.save();
  return servicio;
}


async function retrocederEstado(idServicio) {
  const servicio = await Servicio.findOne({ where: { idServicio, activo: true } });
  if (!servicio) throw new Error('Servicio no encontrado o inactivo');

  const estadoActual = await EstadoServicio.findByPk(servicio.idEstadoActual);
  if (!estadoActual) throw new Error('Estado actual inválido');

  if (estadoActual.nombreEstado.toLowerCase() === 'entregado') {
    throw new Error('No se puede retroceder: el servicio ya fue entregado');
  }

  const estadoAnterior = await EstadoServicio.findOne({
    where: { idEstado: estadoActual.idEstado - 1 }
  });

  if (!estadoAnterior) throw new Error('No se puede retroceder más');

  servicio.idEstadoActual = estadoAnterior.idEstado;
  await servicio.save();

  return servicio;
}


/**
 * Eliminar servicio (borrado lógico)
 */
async function eliminarServicio(idServicio) {
    const servicio = await Servicio.findOne({ where: { idServicio, activo: true } });
    if (!servicio) throw new Error('Servicio no encontrado o ya inactivo');

    await servicio.update({ activo: false });
    return { mensaje: 'Servicio eliminado correctamente' };
}

module.exports = {
    registrarServicio,
    obtenerTodos,
    obtenerPorId,
    actualizarEstado,
    eliminarServicio,
    actualizarDatosServicio,
    avanzarEstado,
    retrocederEstado
};
