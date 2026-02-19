const Prestamo = require('../models/Prestamo');

exports.getAllPrestamos = async (req, res) => {
    try {
        const prestamos = await Prestamo.find().populate('libro').populate('miembro');
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPrestamoById = async (req, res) => {
    try {
        const prestamo = await Prestamo.findById(req.params.id).populate('libro').populate('miembro');
        if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
        res.json(prestamo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPrestamo = async (req, res) => {
    try {
        const { libro, miembro, fecha_prestamo, fecha_devolucion, estado } = req.body;
        const nuevoPrestamo = new Prestamo({ libro, miembro, fecha_prestamo, fecha_devolucion, estado });
        await nuevoPrestamo.save();
        res.status(201).json(nuevoPrestamo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updatePrestamo = async (req, res) => {
    try {
        const prestamo = await Prestamo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
        res.json(prestamo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePrestamo = async (req, res) => {
    try {
        const prestamo = await Prestamo.findByIdAndDelete(req.params.id);
        if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
        res.json({ message: 'Préstamo eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};