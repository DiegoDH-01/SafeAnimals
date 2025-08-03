const mascotaService = require('../services/mascota.Service');
const { auditar } = require('../utils/auditoria'); // ← importar utilidad

// Crear una nueva mascota con imagen
async function registrar(req, res) {
  try {
    const { nombre, raza, idDueno, duenio_confirmado } = req.body;
    const foto = req.file?.filename || null;
    if (!foto) return res.status(400).json({ error: 'La imagen es requerida' });

    if (!nombre || !raza || !idDueno || !foto) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const nuevaMascota = await mascotaService.registrarMascota({ nombre, raza, idDueno, foto, duenio_confirmado });

    await auditar({
      tabla: 'mascota',
      operacion: 'INSERT',
      idRegistro: nuevaMascota.idMascota,
      datosNuevos: { nombre, raza, idDueno, foto, duenio_confirmado },
      usuario: `${req.usuario.nombres} ${req.usuario.apellidos}`
    });

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

// Actualizar mascota (datos generales o imagen)
async function actualizar(req, res) {
  try {
    const id = req.params.id;
    const { nombre, raza, idDueno } = req.body;
    const nuevaFoto = req.file?.filename;

    const mascotaAntes = await mascotaService.obtenerPorId(id);

    const mascotaActualizada = await mascotaService.actualizarMascota(id, {
      nombre,
      raza,
      idDueno,
      foto: nuevaFoto
    });

    await auditar({
      tabla: 'mascota',
      operacion: 'UPDATE',
      idRegistro: id,
      datosPrevios: mascotaAntes,
      datosNuevos: { nombre, raza, idDueno, foto: nuevaFoto },
      usuario: `${req.usuario.nombres} ${req.usuario.apellidos}`
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
    const { duenio_confirmado } = req.body;

    if (duenio_confirmado === undefined) {
      return res.status(400).json({ error: 'El campo duenio_confirmado es requerido' });
    }

    const mascotaAntes = await mascotaService.obtenerPorId(id);
    const mascotaActualizada = await mascotaService.verificarDueno(id, duenio_confirmado);

    await auditar({
      tabla: 'mascota',
      operacion: 'UPDATE',
      idRegistro: id,
      datosPrevios: mascotaAntes,
      datosNuevos: { duenio_confirmado },
      usuario: `${req.usuario.nombres} ${req.usuario.apellidos}`
    });

    res.status(200).json(mascotaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminación lógica
async function eliminar(req, res) {
  try {
    const id = req.params.id;
    const mascotaAntes = await mascotaService.obtenerPorId(id);
    const resultado = await mascotaService.eliminarMascota(id);

    await auditar({
      tabla: 'mascota',
      operacion: 'DELETE',
      idRegistro: id,
      datosPrevios: mascotaAntes,
      usuario: `${req.usuario.nombres} ${req.usuario.apellidos}`
    });

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
  verificarDueno
};
