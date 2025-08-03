import axios from 'axios';

export async function getMascotas() {
  try {
    const res = await axios.get('http://localhost:3000/api/mascotas');
    return Array.isArray(res.data)
      ? res.data.map(m => ({
          id: m.idMascota,
          nombre: m.nombre,
          raza: m.raza,
          foto: m.foto,
          idDueno: m.idDueno
        }))
      : [];
  } catch {
    return [];
  }
}
