import axios from 'axios';

export async function getEstados() {
  try {
    const res = await axios.get('http://localhost:3000/api/estadoservicio');
    return Array.isArray(res.data)
      ? res.data.map(e => ({
          id: e.idEstado,
          nombre: e.nombreEstado
        }))
      : [];
  } catch {
    return [];
  }
}
