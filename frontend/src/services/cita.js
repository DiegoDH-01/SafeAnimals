import axios from 'axios';

export async function getCitas() {
  try {
    const res = await axios.get('http://localhost:3000/api/servicios');
    return Array.isArray(res.data)
      ? res.data.map(c => ({
          idServicio: c.idServicio,
          fechaRegistro: c.fechaRegistro,
          referencia: c.referencia,
          mascota: c.mascota?.nombre || '',
          usuario: c.usuario?.nombres || '',
          estado: c.estado?.nombreEstado || '',
          idMascota: c.idMascota,
          idUsuario: c.idUsuario,
          idEstadoActual: c.idEstadoActual
        }))
      : [];
  } catch {
    return [];
  }
}

export async function getCitasEntregadasHoy() {
  try {
    const res = await axios.get('http://localhost:3000/api/servicios/entregados');
    return Array.isArray(res.data)
      ? res.data.map(c => ({
          idServicio: c.idServicio,
          fechaRegistro: c.fechaFinalizacion,
          referencia: c.referencia,
          mascota: c.mascota?.nombre || '',
          usuario: c.usuario?.nombres || '',
          estado: c.estado?.nombreEstado || '',
          idMascota: c.idMascota,
          idUsuario: c.idUsuario,
          idEstadoActual: c.idEstadoActual
        }))
      : [];
  } catch {
    return [];
  }
}

export async function getReporteServicioEntregado(idServicio) {
  try {
    const res = await axios.get(`http://localhost:3000/api/servicios/entregados`);
    if (Array.isArray(res.data)) {
      return res.data.find(s => s.idServicio === idServicio) || null;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener el reporte del servicio entregado', error);
    return null;
  }
}

