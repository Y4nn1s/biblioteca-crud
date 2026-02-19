# 📚 Biblioteca CRUD API

API REST para la gestión de una biblioteca desarrollada con **Node.js**, **Express** y **MongoDB** (Mongoose). Permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre cinco colecciones: autores, categorías, libros, miembros y préstamos.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v14 o superior)
- [MongoDB](https://www.mongodb.com/) (instancia local o [MongoDB Atlas](https://www.mongodb.com/atlas))

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/biblioteca-crud.git
   cd biblioteca-crud
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

   ```env
   MONGODB_URI=mongodb://localhost:27017/biblioteca
   PORT=3000
   ```

   > Si usas **MongoDB Atlas**, reemplaza la URI con la cadena de conexión proporcionada por Atlas.

4. **(Opcional) Poblar la base de datos con datos de prueba**

   ```bash
   node seed.js
   ```

5. **Iniciar el servidor**

   ```bash
   npm start
   ```

   O en modo desarrollo (con reinicio automático usando **nodemon**):

   ```bash
   npm run dev
   ```

   Deberías ver los mensajes: `Conectado a la BD` y `Servidor corriendo en puerto 3000`.

## 📁 Estructura del Proyecto

```
biblioteca-crud/
├── controllers/         # Lógica de negocio de cada colección
│   ├── autorController.js
│   ├── categoriaController.js
│   ├── libroController.js
│   ├── miembroController.js
│   └── prestamoController.js
├── models/              # Esquemas de Mongoose
│   ├── Autor.js
│   ├── Categoria.js
│   ├── Libro.js
│   ├── Miembro.js
│   └── Prestamo.js
├── routes/              # Definición de rutas de la API
│   ├── autores.js
│   ├── categorias.js
│   ├── libros.js
│   ├── miembros.js
│   └── prestamos.js
├── app.js               # Punto de entrada de la aplicación
├── seed.js              # Script para poblar la BD con datos iniciales
├── package.json         # Dependencias y scripts del proyecto
├── .env                 # Variables de entorno (no se sube al repositorio)
└── .gitignore           # Archivos ignorados por Git
```

## 🔗 Endpoints de la API

La URL base es `http://localhost:3000/api`. Todas las colecciones comparten los mismos métodos CRUD:

| Método   | Ruta                   | Descripción                      |
| -------- | ---------------------- | -------------------------------- |
| `GET`    | `/api/{colección}`     | Obtener todos los registros      |
| `GET`    | `/api/{colección}/:id` | Obtener un registro por su ID    |
| `POST`   | `/api/{colección}`     | Crear un nuevo registro          |
| `PUT`    | `/api/{colección}/:id` | Actualizar un registro existente |
| `DELETE` | `/api/{colección}/:id` | Eliminar un registro             |

Donde `{colección}` puede ser: `autores`, `categorias`, `libros`, `miembros` o `prestamos`.

### Ejemplos de uso con cURL

**Obtener todos los autores:**

```bash
curl http://localhost:3000/api/autores
```

**Crear un nuevo autor:**

```bash
curl -X POST http://localhost:3000/api/autores \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Gabriel García Márquez", "nacionalidad": "Colombiana", "biografia": "Escritor y periodista colombiano"}'
```

**Actualizar un autor:**

```bash
curl -X PUT http://localhost:3000/api/autores/ID_DEL_AUTOR \
  -H "Content-Type: application/json" \
  -d '{"nacionalidad": "Colombiana"}'
```

**Eliminar un autor:**

```bash
curl -X DELETE http://localhost:3000/api/autores/ID_DEL_AUTOR
```

## 🗂️ Modelos de Datos

### Autor

| Campo              | Tipo   | Requerido |
| ------------------ | ------ | --------- |
| `nombre`           | String | ✅        |
| `nacionalidad`     | String | ❌        |
| `fecha_nacimiento` | Date   | ❌        |
| `biografia`        | String | ❌        |

### Categoría

| Campo            | Tipo    | Requerido  | Por defecto  |
| ---------------- | ------- | ---------- | ------------ |
| `nombre`         | String  | ✅ (único) | —            |
| `descripcion`    | String  | ❌         | —            |
| `fecha_creacion` | Date    | ❌         | Fecha actual |
| `activo`         | Boolean | ❌         | `true`       |

### Libro

| Campo        | Tipo     | Requerido            |
| ------------ | -------- | -------------------- |
| `titulo`     | String   | ✅                   |
| `autor`      | ObjectId | ✅ (ref: Autor)      |
| `isbn`       | String   | ✅ (único)           |
| `anio`       | Number   | ✅                   |
| `disponible` | Boolean  | ❌ (default: `true`) |

### Miembro

| Campo            | Tipo   | Requerido  | Por defecto  |
| ---------------- | ------ | ---------- | ------------ |
| `nombre`         | String | ✅         | —            |
| `email`          | String | ✅ (único) | —            |
| `telefono`       | String | ❌         | —            |
| `fecha_registro` | Date   | ❌         | Fecha actual |

### Préstamo

| Campo              | Tipo     | Requerido         | Por defecto                           |
| ------------------ | -------- | ----------------- | ------------------------------------- |
| `libro`            | ObjectId | ✅ (ref: Libro)   | —                                     |
| `miembro`          | ObjectId | ✅ (ref: Miembro) | —                                     |
| `fecha_prestamo`   | Date     | ❌                | Fecha actual                          |
| `fecha_devolucion` | Date     | ❌                | —                                     |
| `estado`           | String   | ❌                | `activo` (enum: `activo`, `devuelto`) |

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción                                |
| ---------- | ------- | ------------------------------------------ |
| Node.js    | v14+    | Entorno de ejecución de JavaScript         |
| Express    | ^5.2.1  | Framework web para Node.js                 |
| Mongoose   | ^9.2.1  | ODM para MongoDB                           |
| dotenv     | ^17.3.1 | Carga de variables de entorno desde `.env` |
| nodemon    | ^3.1.11 | Reinicio automático en desarrollo (devDep) |

## 📜 Scripts Disponibles

| Comando       | Descripción                                            |
| ------------- | ------------------------------------------------------ |
| `npm start`   | Inicia el servidor con `node app.js`                   |
| `npm run dev` | Inicia el servidor con `nodemon` (reinicio automático) |
