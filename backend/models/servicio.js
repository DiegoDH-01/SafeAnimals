const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servicio = sequelize.define('Servicio', {
  idServicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaRegistro: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFinalizacion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  referencia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  idMascota: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idEstadoActual: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'servicio',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Servicio;
