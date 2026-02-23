const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a la BD'))
    .catch(err => console.error('Error al conectar a la BD:', err));

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

app.get('/api/test', (req, res) => {
    console.log('Hit test route');
    res.json({ ok: true });
});

// Rutas
app.use('/api/autores', require('./routes/autores'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/libros', require('./routes/libros'));
app.use('/api/miembros', require('./routes/miembros'));
app.use('/api/prestamos', require('./routes/prestamos'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});