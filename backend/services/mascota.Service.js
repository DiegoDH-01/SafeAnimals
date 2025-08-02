const { Mascota, Dueno } = require('../models');
const fs = require('fs');
const path = require('path');

/**
 * Registrar una nueva mascota con foto
 */
async function registrarMascota(data) {
  const { nombre, raza, foto, idDueno } = data;

  if (!idDueno) {
    throw new Error('El campo idDueno es obligatorio');
  }

  const dueno = await Dueno.findOne({ where: { idDueno, activo: true } });
  if (!dueno) {
    throw new Error('Dueño no encontrado o inactivo');
  }

  const nuevaMascota = await Mascota.create({
    nombre,
    raza,
    foto, // solo el nombre del archivo
    idDueno,
    activo: true
  });

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
      as: 'dueno',
      attributes: ['idDueno', 'nombres', 'apellidos', 'email', 'celular']
    }]
  });
}

/**
 * Obtener una mascota por ID
 */
async function obtenerPorId(idMascota) {
  const mascota = await Mascota.findOne({
    where: { idMascota, activo: true },
    include: [{
      model: Dueno,
      as: 'dueno',
      attributes: ['idDueno', 'nombres', 'apellidos', 'email', 'celular']
    }]
  });

  if (!mascota) throw new Error('Mascota no encontrada');
  return mascota;
}

/**
 * Actualizar datos de una mascota (con reemplazo de imagen si se proporciona)
 */
async function actualizarMascota(idMascota, data) {
  const mascota = await Mascota.findByPk(idMascota);
  if (!mascota || !mascota.activo) {
    throw new Error('Mascota no encontrada o inactiva');
  }

  // Eliminar imagen anterior si se proporciona una nueva
  if (data.foto && mascota.foto && data.foto !== mascota.foto) {
    const oldPath = path.join(__dirname, '..', 'uploads', mascota.foto);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    mascota.foto = data.foto;
  }

  mascota.nombre = data.nombre || mascota.nombre;
  mascota.raza = data.raza || mascota.raza;
  mascota.idDueno = data.idDueno || mascota.idDueno;

  await mascota.save();
  return mascota;
}

/**
 * Eliminación lógica de una mascota
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
