const Dueno = require('./dueno');
const Mascota = require('./mascota');
const Usuario = require('./usuario');
const Servicio = require('./servicio');
const EstadoServicio = require('./estadoServicio');
const Notificacion = require('./notificacion');
// Asociaciones entre Dueno y Mascota
Dueno.hasMany(Mascota, { foreignKey: 'idDueno', as: 'mascotas' });
Mascota.belongsTo(Dueno, { foreignKey: 'idDueno', as: 'dueno' });

// Asociaciones entre Mascota y Servicio
Mascota.hasMany(Servicio, { foreignKey: 'idMascota', as: 'servicios' });
Servicio.belongsTo(Mascota, { foreignKey: 'idMascota', as: 'mascota' });

// Asociaciones entre Usuario (RECEPCIONISTA) y Servicio
Usuario.hasMany(Servicio, { foreignKey: 'idUsuario', as: 'serviciosRegistrados' });
Servicio.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

// Asociaciones entre EstadoServicio y Servicio
EstadoServicio.hasMany(Servicio, { foreignKey: 'idEstadoActual', as: 'servicios' });
Servicio.belongsTo(EstadoServicio, { foreignKey: 'idEstadoActual', as: 'estado' });

// Asociación entre Servicio y Notificación
Servicio.hasMany(Notificacion, { foreignKey: 'idServicio', as: 'notificaciones' });
Notificacion.belongsTo(Servicio, { foreignKey: 'idServicio', as: 'servicio' });

module.exports = {
  Dueno,
  Mascota,
  Usuario,
  Servicio,
  EstadoServicio,
  Notificacion
};
