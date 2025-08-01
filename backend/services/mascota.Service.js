const { Mascota, Dueno } = require('../models');

/**
 * Registrar una nueva mascota
 */
async function registrarMascota(data) {
  const { nombre, raza, foto, idDueno } = data;

  if (!idDueno) {
    throw new Error('El campo idDueno es obligatorio');
  }

  // Validar que el dueño exista y esté activo
  const dueno = await Dueno.findOne({ where: { idDueno, activo: true } });
  if (!dueno) {
    throw new Error('Dueño no encontrado o inactivo');
  }

  const nuevaMascota = await Mascota.create({ nombre, raza, foto, idDueno });
  return nuevaMascota;
}

/**
 * Obtener todas las mascotas activas con datos del dueño
 */
async function obtenerTodas() {
  return await Mascota.findAll({
    where: { activo: true },
    include: [{
      model: Dueno,
      as: 'dueno', // alias correcto
      attributes: ['idDueno', 'nombres', 'apellidos', 'email', 'celular']
    }]
  });
}

/**
 * Obtener una mascota por su ID (con datos del dueño)
 */
async function obtenerPorId(idMascota) {
  const mascota = await Mascota.findOne({
    where: { idMascota, activo: true },
    include: [{
      model: Dueno,
      as: 'dueno', // alias correcto
      attributes: ['idDueno', 'nombres', 'apellidos', 'email', 'celular']
    }]
  });

  if (!mascota) throw new Error('Mascota no encontrada');
  return mascota;
}

/**
 * Actualizar datos de una mascota
 */
async function actualizarMascota(idMascota, data) {
  const mascota = await Mascota.findByPk(idMascota);
  if (!mascota || !mascota.activo) {
    throw new Error('Mascota no encontrada o inactiva');
  }

  await mascota.update(data);
  return mascota;
}

/**
 * Eliminar mascota (lógico)
 */
async function eliminarMascota(idMascota) {
  const mascota = await Mascota.findByPk(idMascota);
  if (!mascota || !mascota.activo) {
    throw new Error('Mascota no encontrada o ya está inactiva');
  }

  await mascota.update({ activo: false });
  return { mensaje: 'Mascota eliminada correctamente' };
}

module.exports = {
  registrarMascota,
  obtenerTodas,
  obtenerPorId,
  actualizarMascota,
  eliminarMascota
};
