const sequelize = require('../config/database');

// Importar todos los modelos
const Usuario = require('./usuario');
const Dueno = require('./dueno');
const Mascota = require('./mascota');
const Servicio = require('./servicio');
const EstadoServicio = require('./estadoServicio');

// Aplicar asociaciones
require('./associations'); // ejecuta y aplica las relaciones

// Exportar todos los modelos y la instancia de Sequelize
const db = {
  sequelize,
  Usuario,
  Dueno,
  Mascota,
  Servicio,
  EstadoServicio
};

module.exports = db;
