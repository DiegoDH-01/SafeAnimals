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
