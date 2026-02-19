require('dotenv').config();
const mongoose = require('mongoose');
const Autor = require('./models/Autor');
const Categoria = require('./models/Categoria');
const Libro = require('./models/Libro');
const Miembro = require('./models/Miembro');
const Prestamo = require('./models/Prestamo');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log('Conectado a MongoDB para seeding...');

    // Para limpieza de colecciones
    await Autor.deleteMany();
    await Categoria.deleteMany();
    await Libro.deleteMany();
    await Miembro.deleteMany();
    await Prestamo.deleteMany();

    
    // 1. Crear autores (4)
    const autor1 = await new Autor({
        nombre: 'Gabriel García Márquez',
        nacionalidad: 'Colombiana',
        fecha_nacimiento: '1927-03-06',
        biografia: 'Escritor colombiano, premio Nobel de Literatura 1982.'
    }).save();

    const autor2 = await new Autor({
        nombre: 'Isabel Allende',
        nacionalidad: 'Chilena',
        fecha_nacimiento: '1942-08-02',
        biografia: 'Escritora chilena, autora de La casa de los espíritus.'
    }).save();

    const autor3 = await new Autor({
        nombre: 'Julio Cortázar',
        nacionalidad: 'Argentina',
        fecha_nacimiento: '1914-08-26',
        biografia: 'Escritor argentino, autor de Rayuela.'
    }).save();

    const autor4 = await new Autor({
        nombre: 'Mario Vargas Llosa',
        nacionalidad: 'Peruana',
        fecha_nacimiento: '1936-03-28',
        biografia: 'Escritor peruano, premio Nobel de Literatura 2010.'
    }).save();

    
    // 2. Crear categorías (4)
    const cat1 = await new Categoria({
        nombre: 'Novela',
        descripcion: 'Obra literaria narrativa de cierta extensión.'
    }).save();

    const cat2 = await new Categoria({
        nombre: 'Cuento',
        descripcion: 'Narración breve de carácter ficcional.'
    }).save();

    const cat3 = await new Categoria({
        nombre: 'Ensayo',
        descripcion: 'Texto en prosa que analiza o reflexiona sobre un tema.'
    }).save();

    const cat4 = await new Categoria({
        nombre: 'Poesía',
        descripcion: 'Género literario en verso.'
    }).save();

    
    // 3. Crear libros (4)
    const libro1 = await new Libro({
        titulo: 'Cien años de soledad',
        autor: autor1._id,
        isbn: '978-3-16-148410-0',
        anio: 1967,
        disponible: true
    }).save();

    const libro2 = await new Libro({
        titulo: 'El amor en los tiempos del cólera',
        autor: autor1._id,
        isbn: '978-3-16-148410-1',
        anio: 1985,
        disponible: true
    }).save();

    const libro3 = await new Libro({
        titulo: 'La casa de los espíritus',
        autor: autor2._id,
        isbn: '978-3-16-148410-2',
        anio: 1982,
        disponible: true
    }).save();

    const libro4 = await new Libro({
        titulo: 'Rayuela',
        autor: autor3._id,
        isbn: '978-3-16-148410-3',
        anio: 1963,
        disponible: true
    }).save();

    
    // 4. Crear miembros (4)
    const miembro1 = await new Miembro({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '12345678'
    }).save();

    const miembro2 = await new Miembro({
        nombre: 'María García',
        email: 'maria@example.com',
        telefono: '87654321'
    }).save();

    const miembro3 = await new Miembro({
        nombre: 'Carlos López',
        email: 'carlos@example.com',
        telefono: '11223344'
    }).save();

    const miembro4 = await new Miembro({
        nombre: 'Ana Martínez',
        email: 'ana@example.com',
        telefono: '44332211'
    }).save();

    
    // 5. Crear préstamos (4)
    await new Prestamo({
        libro: libro1._id,
        miembro: miembro1._id,
        fecha_prestamo: new Date('2025-01-10'),
        fecha_devolucion: new Date('2025-01-20'),
        estado: 'devuelto'
    }).save();

    await new Prestamo({
        libro: libro2._id,
        miembro: miembro2._id,
        fecha_prestamo: new Date(),
        estado: 'activo'
    }).save();

    await new Prestamo({
        libro: libro3._id,
        miembro: miembro3._id,
        fecha_prestamo: new Date('2025-02-01'),
        estado: 'activo'
    }).save();

    await new Prestamo({
        libro: libro4._id,
        miembro: miembro4._id,
        fecha_prestamo: new Date('2025-01-15'),
        fecha_devolucion: new Date('2025-01-25'),
        estado: 'devuelto'
    }).save();

    console.log('Datos insertados correctamente');
    mongoose.disconnect();
})
.catch(err => {
    console.error('Error en seeding:', err);
    mongoose.disconnect();
});