const usuarioService = require('../services/usuario.Service');

async function registrar(req, res) {
  try {
    const { usuario, token } = await usuarioService.registrarUsuario(req.body);
    res.status(201).json({ usuario, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { usuario, token } = await usuarioService.login(email, password);
    res.status(200).json({ usuario, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
async function getMe(req, res) {
  // No devolver password
  const { password, ...usuarioSinPassword } = req.usuario.toJSON();
  res.json(usuarioSinPassword);
}

module.exports = { registrar, login, getMe };
