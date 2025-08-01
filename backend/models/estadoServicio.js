// models/estadoServicio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const estadoServicio = sequelize.define('EstadoServicio', {
  idEstado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreEstado: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'estadoservicio',
  timestamps: false
});

module.exports = estadoServicio;
