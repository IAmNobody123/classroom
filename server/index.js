const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth.routes');

app.use('/uploads/img/perfil', express.static(path.join(__dirname, 'uploads/img/perfil')));
app.use('/uploads/img/alumnosCursos', express.static(path.join(__dirname, 'uploads/img/alumnosCursos')));
app.use('/uploads/docs', express.static(path.join(__dirname, 'uploads/docs')));
app.use('/uploads/docs/temp', express.static(path.join(__dirname, 'uploads/docs/temp')));
app.use('/api', authRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
