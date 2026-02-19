const Autor = require('../models/Autor');

// Obtener todos los autores
exports.getAllAutores = async (req, res) => {
    try {
        const autores = await Autor.find();
        res.json(autores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un autor por ID
exports.getAutorById = async (req, res) => {
    try {
        const autor = await Autor.findById(req.params.id);
        if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });
        res.json(autor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un autor
exports.createAutor = async (req, res) => {
    try {
        const { nombre, nacionalidad, fecha_nacimiento, biografia } = req.body;
        const nuevoAutor = new Autor({ nombre, nacionalidad, fecha_nacimiento, biografia });
        await nuevoAutor.save();
        res.status(201).json(nuevoAutor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un autor
exports.updateAutor = async (req, res) => {
    try {
        const autor = await Autor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });
        res.json(autor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un autor
exports.deleteAutor = async (req, res) => {
    try {
        const autor = await Autor.findByIdAndDelete(req.params.id);
        if (!autor) return res.status(404).json({ message: 'Autor no encontrado' });
        res.json({ message: 'Autor eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};