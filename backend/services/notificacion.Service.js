const { Notificacion, Servicio, Mascota, Dueno } = require('../models');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

/**
 * Envía un mensaje por WhatsApp al número dado
 */
async function enviarMensajeWhatsApp(numeroDestino, mensaje) {
  const numeroFormateado = `whatsapp:+593${numeroDestino.slice(1)}`; // Quito el 0 inicial, agrego +593

  console.log('-----------------------------');
  console.log('[TWILIO] Número original:', numeroDestino);
  console.log('[TWILIO] Número formateado:', numeroFormateado);
  console.log('[TWILIO] Mensaje:', mensaje);
  console.log('-----------------------------');

  const response = await client.messages.create({
    from: process.env.TWILIO_PHONE,
    to: numeroFormateado,
    body: mensaje
  });

  console.log('[TWILIO] Mensaje enviado con SID:', response.sid);
  return response;
}

/**
 * Registrar una nueva notificación y enviar WhatsApp, si no existe ya para ese servicio
 */
async function registrarNotificacion({ idServicio, mensaje, medio = 'WhatsApp' }) {
  if (!idServicio || !mensaje) {
    throw new Error('Faltan campos obligatorios: idServicio y mensaje');
  }

  // Buscar el servicio junto con la mascota y su dueño
  const servicio = await Servicio.findOne({
    where: { idServicio, activo: true },
    include: {
      model: Mascota,
      as: 'mascota',
      include: { model: Dueno, as: 'dueno' }
    }
  });

  if (!servicio) {
    throw new Error('Servicio no encontrado o inactivo');
  }

  // Validar que no se haya enviado ya una notificación para este servicio
  const yaNotificada = await Notificacion.findOne({ where: { idServicio } });
  if (yaNotificada) {
    throw new Error('Ya se ha enviado una notificación para este servicio');
  }

  // Validar que el número del dueño exista
  const numero = servicio.mascota?.dueno?.celular;
  console.log('[DEBUG] Celular recuperado del dueño:', numero);

  if (!numero || !numero.startsWith('09')) {
    throw new Error('Número del dueño inválido o no disponible');
  }

  // Datos para personalizar el mensaje
  const nombreDueno = servicio.mascota?.dueno?.nombres || 'cliente';
  const nombreMascota = servicio.mascota?.nombre || 'tu mascota';
  const tipoServicio = servicio.referencia || 'el servicio';

  // Mensaje final personalizado
  const mensajePersonalizado = `Hola ${nombreDueno}, el servicio de *${tipoServicio}* para tu mascota ${nombreMascota} ha finalizado exitosamente. 🐶✨\n\nGracias por confiar en SafeAnimals. Puedes pasar a retirarla cuando gustes.`;

  // Enviar el mensaje por WhatsApp
  await enviarMensajeWhatsApp(numero, mensajePersonalizado);

  // Registrar la notificación
  const notificacion = await Notificacion.create({
    idServicio,
    mensaje: mensajePersonalizado,
    medio
  });

  console.log('[NOTIFICACIÓN] Registrada correctamente para el servicio', idServicio);
  return notificacion;
}

/**
 * Obtener todas las notificaciones con info del servicio y dueño
 */
async function obtenerTodas() {
  return await Notificacion.findAll({
    include: [
      {
        model: Servicio,
        as: 'servicio',
        include: [
          {
            model: Mascota,
            as: 'mascota',
            include: [{ model: Dueno, as: 'dueno' }]
          }
        ]
      }
    ],
    order: [['fechaEnvio', 'DESC']]
  });
}

module.exports = {
  registrarNotificacion,
  obtenerTodas
};
