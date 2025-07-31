const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mascota = sequelize.define('Mascota', {
  idMascota: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  raza: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  foto: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  idDueno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
}, {
  tableName: 'mascota',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Mascota;
