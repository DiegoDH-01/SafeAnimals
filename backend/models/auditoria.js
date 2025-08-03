module.exports = (sequelize, DataTypes) => {
  const Auditoria = sequelize.define('Auditoria', {
    idAuditoria: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tabla: {
      type: DataTypes.STRING,
      allowNull: false
    },
    operacion: {
      type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
      allowNull: false
    },
    idRegistro: {
      type: DataTypes.INTEGER
    },
    datosPrevios: {
      type: DataTypes.TEXT
    },
    datosNuevos: {
      type: DataTypes.TEXT
    },
    usuario: {
      type: DataTypes.STRING
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'auditoria',
    timestamps: false
  });

  return Auditoria;
};
