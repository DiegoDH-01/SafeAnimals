// utils/auditoria.js
const { Auditoria } = require('../models');

async function auditar({ tabla, operacion, idRegistro, datosPrevios, datosNuevos, usuario }) {
  try {
    await Auditoria.create({
      tabla,
      operacion,
      idRegistro,
      datosPrevios: datosPrevios ? JSON.stringify(datosPrevios) : null,
      datosNuevos: datosNuevos ? JSON.stringify(datosNuevos) : null,
      usuario
    });
  } catch (error) {
    console.error('[AUDITORIA] Error al guardar auditoría:', error.message);
  }
}

module.exports = { auditar };
