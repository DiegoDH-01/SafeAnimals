const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Buscar usuario por id
    const usuario = await Usuario.findByPk(decoded.id || decoded.idUsuario);
    if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });
    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = authMiddleware;
