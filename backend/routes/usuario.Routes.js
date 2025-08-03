const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.Controller');
const auth = require('../middleware/auth');

router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/me', auth, usuarioController.getMe);
module.exports = router;
