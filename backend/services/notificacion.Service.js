const { Notificacion, Servicio, Mascota, Dueno } = require('../models');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function enviarMensajeWhatsApp(numeroDestino, mensaje) {
  const numeroFormateado = `whatsapp:+593${numeroDestino.slice(1)}`;

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
 * Registrar una nueva notificación y enviar WhatsApp, si no existe ya para ese servicio y tipo
 */
async function registrarNotificacion({ idServicio, tipo = 'finalizado', medio = 'WhatsApp' }) {
  if (!idServicio || !tipo) {
    throw new Error('Faltan campos obligatorios: idServicio y tipo');
  }

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

  const yaNotificada = await Notificacion.findOne({
    where: { idServicio, mensaje: { [require('sequelize').Op.like]: `%${tipo}%` } }
  });

  if (yaNotificada) {
    throw new Error(`Ya se ha enviado una notificación de tipo ${tipo} para este servicio`);
  }

  const numero = servicio.mascota?.dueno?.celular;
  console.log('[DEBUG] Celular recuperado del dueño:', numero);

  if (!numero || !numero.startsWith('09')) {
    throw new Error('Número del dueño inválido o no disponible');
  }

  const nombreDueno = servicio.mascota?.dueno?.nombres || 'cliente';
  const nombreMascota = servicio.mascota?.nombre || 'tu mascota';
  const tipoServicio = servicio.referencia || 'el servicio';

  let mensajePersonalizado = '';

  if (tipo === 'finalizado') {
    mensajePersonalizado = `Hola ${nombreDueno}, el servicio de *${tipoServicio}* para tu mascota ${nombreMascota} ha finalizado exitosamente. 🐶✨

Gracias por confiar en SafeAnimals. Puedes pasar a retirarla cuando gustes.`;
  } else if (tipo === 'entregado') {
    mensajePersonalizado = `Hola ${nombreDueno}, confirmamos que tu mascota ${nombreMascota} ya fue entregada luego del servicio de *${tipoServicio}*. 🏠🐾

¡Gracias por preferir SafeAnimals! Hasta la próxima.`;
  } else {
    mensajePersonalizado = `Hola ${nombreDueno}, tenemos una actualización sobre tu mascota ${nombreMascota}.`;
  }

  await enviarMensajeWhatsApp(numero, mensajePersonalizado);

  const notificacion = await Notificacion.create({
    idServicio,
    mensaje: mensajePersonalizado,
    medio
  });

  console.log(`[NOTIFICACIÓN] (${tipo}) Registrada correctamente para el servicio`, idServicio);
  return notificacion;
}

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
