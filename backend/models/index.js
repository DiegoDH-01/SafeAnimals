const sequelize = require('../config/database');
const Usuario = require('./usuario');

const db = {
  sequelize,
  Usuario,
};

module.exports = db;
