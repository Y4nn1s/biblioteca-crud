const mongoose = require('mongoose');

const autorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nacionalidad: { type: String },
    fecha_nacimiento: { type: Date },
    biografia: { type: String }
});

module.exports = mongoose.model('Autor', autorSchema);

