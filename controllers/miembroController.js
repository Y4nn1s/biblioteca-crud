const Miembro = require('../models/Miembro');

exports.getAllMiembros = async (req, res) => {
    try {
        const miembros = await Miembro.find();
        res.json(miembros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMiembroById = async (req, res) => {
    try {
        const miembro = await Miembro.findById(req.params.id);
        if (!miembro) return res.status(404).json({ message: 'Miembro no encontrado' });
        res.json(miembro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMiembro = async (req, res) => {
    try {
        const { nombre, email, telefono } = req.body;
        const nuevoMiembro = new Miembro({ nombre, email, telefono });
        await nuevoMiembro.save();
        res.status(201).json(nuevoMiembro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMiembro = async (req, res) => {
    try {
        const miembro = await Miembro.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!miembro) return res.status(404).json({ message: 'Miembro no encontrado' });
        res.json(miembro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMiembro = async (req, res) => {
    try {
        const miembro = await Miembro.findByIdAndDelete(req.params.id);
        if (!miembro) return res.status(404).json({ message: 'Miembro no encontrado' });
        res.json({ message: 'Miembro eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};