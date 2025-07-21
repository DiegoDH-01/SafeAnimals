// backend/routes/animal.routes.js
const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/AnimalController');

router.get('/', AnimalController.getAnimales);

module.exports = router;
