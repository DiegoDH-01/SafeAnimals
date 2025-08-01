// backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();
const usuarioRoutes = require('./routes/usuario.Routes');
const duenoRoutes = require('./routes/dueno.Routes'); 
const mascotaRoutes = require('./routes/mascota.Routes');
const estadoServicioRoutes = require('./routes/estadoServicio.routes');
const servicioRoutes = require('./routes/servicio.Routes');

const db = require('./models');

require('dotenv').config();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


app.use('/api/usuarios', usuarioRoutes);
app.use('/api/duenos', duenoRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/estadoservicio', estadoServicioRoutes);
app.use('/api/servicios', servicioRoutes);


db.sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Base de datos conectada');
    app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
  })
  .catch(err => console.error('Error al conectar BD', err));
