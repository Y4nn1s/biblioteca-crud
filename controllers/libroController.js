const Libro = require('../models/Libro');

exports.getAllLibros = async (req, res) => {
    try {
        const libros = await Libro.find().populate('autor');
        res.json(libros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLibroById = async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id).populate('autor');
        if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json(libro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createLibro = async (req, res) => {
    try {
        const { titulo, autor, isbn, anio, disponible } = req.body;
        const nuevoLibro = new Libro({ titulo, autor, isbn, anio, disponible });
        await nuevoLibro.save();
        res.status(201).json(nuevoLibro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateLibro = async (req, res) => {
    try {
        const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json(libro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLibro = async (req, res) => {
    try {
        const libro = await Libro.findByIdAndDelete(req.params.id);
        if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json({ message: 'Libro eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};