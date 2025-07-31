const Dueno = require('./dueno');
const Mascota = require('./mascota');

Dueno.hasMany(Mascota, { foreignKey: 'idDueno', as: 'mascotas' });
Mascota.belongsTo(Dueno, { foreignKey: 'idDueno', as: 'dueno' });

module.exports = {
  Dueno,
  Mascota,
};
