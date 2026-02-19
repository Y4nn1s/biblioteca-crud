const mongoose = require('mongoose');

const miembroSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Miembro', miembroSchema);

