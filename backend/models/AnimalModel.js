// backend/models/AnimalModel.js
const db = require('./db');

const getAllAnimals = async () => {
  const [rows] = await db.query('SELECT * FROM dueno');
  return rows;
};

module.exports = { getAllAnimals };
