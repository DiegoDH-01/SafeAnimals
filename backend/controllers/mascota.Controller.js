const mascotaService = require('../services/mascota.Service');

// Crear una nueva mascota con imagen
async function registrar(req, res) {
  try {
    const { nombre, raza, idDueno, duenio_confirmado } = req.body;
    const foto = req.file?.filename || null;
    if (!foto) return res.status(400).json({ error: 'La imagen es requerida' });

    if (!nombre || !raza || !idDueno || !foto) {
      console.log('BODY:', req.body);
      console.log('FILE:', req.file);

      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const nuevaMascota = await mascotaService.registrarMascota({ nombre, raza, idDueno, foto, duenio_confirmado });
    res.status(201).json(nuevaMascota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Obtener todas las mascotas activas (con dueño)
async function obtenerTodos(req, res) {
  try {
    const mascotas = await mascotaService.obtenerTodas();
    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener una mascota por ID (si está activa)
async function obtenerPorId(req, res) {
  try {
    const id = req.params.id;
    const mascota = await mascotaService.obtenerPorId(id);
    res.status(200).json(mascota);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// Actualizar mascota (solo datos, no imagen en esta versión)
async function actualizar(req, res) {
  try {
    const id = req.params.id;
    const { nombre, raza, idDueno } = req.body;
    const nuevaFoto = req.file?.filename; // puede no venir

    const mascotaActualizada = await mascotaService.actualizarMascota(id, {
      nombre,
      raza,
      idDueno,
      foto: nuevaFoto
    });

    res.status(200).json(mascotaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Verificar dueño (actualizar duenio_confirmado)
async function verificarDueno(req, res) {
  try {
    const id = req.params.id;
    const { duenio_confirmado } = req.body; // Extraer duenio_confirmado del cuerpo de la solicitud

    if (duenio_confirmado === undefined) {
      return res.status(400).json({ error: 'El campo duenio_confirmado es requerido' });
    }

    const mascotaActualizada = await mascotaService.verificarDueno(id, duenio_confirmado);

    res.status(200).json(mascotaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminación lógica
async function eliminar(req, res) {
  try {
    const id = req.params.id;
    const resultado = await mascotaService.eliminarMascota(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

module.exports = {
  registrar,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
  verificarDueno // Exportar el nuevo método
};
