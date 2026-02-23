export interface Autor {
    _id?: string;
    nombre: string;
    nacionalidad?: string;
    fecha_nacimiento?: string;
    biografia?: string;
}

export interface Categoria {
    _id?: string;
    nombre: string;
    descripcion?: string;
    fecha_creacion?: string;
    activo?: boolean;
}

export interface Libro {
    _id?: string;
    titulo: string;
    autor: Autor | string;
    isbn: string;
    anio: number;
    disponible?: boolean;
}

export interface Miembro {
    _id?: string;
    nombre: string;
    email: string;
    telefono?: string;
    fecha_registro?: string;
}

export interface Prestamo {
    _id?: string;
    libro: Libro | string;
    miembro: Miembro | string;
    fecha_prestamo: string;
    fecha_devolucion?: string;
    estado?: 'activo' | 'devuelto';
}
