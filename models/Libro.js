const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor', required: true },
    isbn: { type: String, required: true, unique: true },
    anio: { type: Number, required: true },
    disponible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Libro', libroSchema);
