// backend/controllers/AnimalController.js
const AnimalModel = require('../models/AnimalModel');

const getAnimales = async (req, res) => {
  try {
    const animales = await AnimalModel.getAllAnimals();
    res.json(animales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAnimales };
