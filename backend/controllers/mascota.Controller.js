const mascotaService = require('../services/mascota.Service');

async function registrar(req, res) {
  try {
    const nuevaMascota = await mascotaService.registrarMascota(req.body);
    res.status(201).json(nuevaMascota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function obtenerTodos(req, res) {
  try {
    const mascotas = await mascotaService.obtenerTodas();
    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const id = req.params.id;
    const mascota = await mascotaService.obtenerPorId(id);
    res.status(200).json(mascota);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const id = req.params.id;
    const mascotaActualizada = await mascotaService.actualizarMascota(id, req.body);
    res.status(200).json(mascotaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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
};
