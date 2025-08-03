const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registrarUsuario(data) {
  const { nombres, apellidos, email, password, rol } = data;
  const usuarioExistente = await Usuario.findOne({ where: { email } });
  if (usuarioExistente) throw new Error('Email ya registrado');

  const hashedPassword = await bcrypt.hash(password, 10);
  const nuevoUsuario = await Usuario.create({
    nombres, apellidos, email, password: hashedPassword, rol
  });

  const token = jwt.sign({ idUsuario: nuevoUsuario.idUsuario, rol }, process.env.JWT_SECRET, { expiresIn: '2h' });

  return { usuario: nuevoUsuario, token };
}

async function login(email, password) {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) throw new Error('Usuario no encontrado');

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) throw new Error('Contraseña incorrecta');

  const token = jwt.sign({ idUsuario: usuario.idUsuario, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '2h' });

  return { usuario, token };
}

module.exports = { registrarUsuario, login};
