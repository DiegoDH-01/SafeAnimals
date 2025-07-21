// backend/app.js
require('dotenv').config();
const express = require('express');
const app = express();
const animalRoutes = require('./routes/animal.routes');

app.use(express.json());
app.use('/api/animales', animalRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
