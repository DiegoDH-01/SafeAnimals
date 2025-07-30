const Dueno = require('../models/dueno');

/**
 * Crear un nuevo dueño
 */
async function registrarDueno(data) {
  const { nombres, apellidos, celular, email } = data;

  // Validación opcional: verificar si ya existe un dueño con ese email
  if (email) {
    const duenoExistente = await Dueno.findOne({ where: { email } });
    if (duenoExistente) throw new Error('Ya existe un dueño con ese email');
  }

  const nuevoDueno = await Dueno.create({ nombres, apellidos, celular, email });
  return nuevoDueno;
}

/**
 * Obtener todos los dueños
 */
async function obtenerTodos() {
  return await Dueno.findAll({ where: { activo: true } });
}


/**
 * Obtener dueño por ID
 */
async function obtenerPorId(idDueno) {
  const dueno = await Dueno.findOne({ where: { idDueno, activo: true } });
  if (!dueno) throw new Error('Dueño no encontrado');
  return dueno;
}
/**
 * Actualizar dueño
 */
async function actualizarDueno(idDueno, data) {
  const dueno = await Dueno.findByPk(idDueno);
  if (!dueno) throw new Error('Dueño no encontrado');

  await dueno.update(data);
  return dueno;
}

/**
 * Eliminar dueño
 */
async function eliminarDueno(idDueno) {
  const dueno = await Dueno.findByPk(idDueno);
  if (!dueno) throw new Error('Dueño no encontrado');

  await dueno.update({ activo: false });
  return { mensaje: 'Dueño eliminado' };
}


module.exports = {
  registrarDueno,
  obtenerTodos,
  obtenerPorId,
  actualizarDueno,
  eliminarDueno
};
