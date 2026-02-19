const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema({
    libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
    miembro: { type: mongoose.Schema.Types.ObjectId, ref: 'Miembro', required: true },
    fecha_prestamo: { type: Date, default: Date.now },
    fecha_devolucion: { type: Date },
    estado: { type: String, enum: ['activo', 'devuelto'], default: 'activo' }
});

module.exports = mongoose.model('Prestamo', prestamoSchema);
