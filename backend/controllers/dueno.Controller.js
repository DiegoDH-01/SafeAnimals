const duenoService = require('../services/dueno.Service');
const { auditar } = require('../utils/auditoria');

async function registrar(req, res) {
  try {
    const nuevoDueno = await duenoService.registrarDueno(req.body);

    await auditar({
      tabla: 'dueno',
      operacion: 'INSERT',
      idRegistro: nuevoDueno.idDueno,
      datosNuevos: req.body,
      usuario: `${req.usuario.nombres} ${req.usuario.apellidos}`
    });

    res.status(201).json(nuevoDueno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function obtenerTodos(req, res) {
  try {
    const duenos = await duenoService.obtenerTodos();
    res.status(200).json(duenos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const id = req.params.id;
    const dueno = await duenoService.obtenerPorId(id);
    res.status(200).json(dueno);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const id = req.params.id;
    const anterior = await duenoService.obtenerPorId(id);
    const duenoActualizado = await duenoService.actualizarDueno(id, req.body);

    await auditar({
      tabla: 'dueno',
      operacion: 'UPDATE',
      idRegistro: id,
      datosPrevios: anterior,
      datosNuevos: req.body,
      usuario: `${req.usuario.nombres} ${req.usuario.apellidos}`
    });

    res.status(200).json(duenoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const id = req.params.id;
    const anterior = await duenoService.obtenerPorId(id);
    const resultado = await duenoService.eliminarDueno(id);

    await auditar({
      tabla: 'dueno',
      operacion: 'DELETE',
      idRegistro: id,
      datosPrevios: anterior,
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
};
