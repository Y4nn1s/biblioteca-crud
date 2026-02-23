# 📚 Biblioteca CRUD API

API REST y Frontend para la gestión de una biblioteca desarrollada con **Node.js**, **Express**, **MongoDB** y **Angular**. Permite realizar operaciones CRUD sobre cinco colecciones: autores, categorías, libros, miembros y préstamos.

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

5. **Iniciar el servidor (Backend)**

   ```bash
   npm start
   ```

   O en modo desarrollo:

   ```bash
   npm run dev
   ```

   Deberías ver: `Conectado a la BD` y `Servidor corriendo en puerto 3000`.

6. **Iniciar el Frontend**

   ```bash
   cd frontend
   npm install
   # Para visualizar la aplicación:
   ng serve
   ```

   Por defecto, la aplicación estará disponible en `http://localhost:4200`.

## 📁 Estructura del Proyecto

```
biblioteca-crud/
├── controllers/         # Lógica de negocio (Backend)
├── models/              # Esquemas de Mongoose (Backend)
├── routes/              # Rutas de la API (Backend)
├── frontend/            # Aplicación Angular (Frontend)
│   ├── src/             # Código fuente de la interfaz
│   ├── package.json     # Dependencias del frontend
│   └── README.md        # Documentación específica del frontend
├── app.js               # Entrada de la API
├── seed.js              # Script de carga de datos
├── package.json         # Dependencias del backend
├── .env                 # Variables de entorno
└── .gitignore           # Archivos ignorados
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

| Tecnología  | Versión | Descripción                      |
| ----------- | ------- | -------------------------------- |
| Node.js     | v14+    | Entorno de ejecución de JS       |
| Express     | ^5.2.1  | Framework web (Backend)          |
| Mongoose    | ^9.2.1  | ODM para MongoDB                 |
| Angular     | ^21.1.0 | Framework web (Frontend)         |
| TailwindCSS | ^3.4.19 | Framework UI (Frontend)          |
| dotenv      | ^17.3.1 | Carga de variables de entorno    |
| nodemon     | ^3.1.11 | Reinicio automático (Desarrollo) |

## 📜 Scripts Disponibles

| Comando                   | Descripción                            |
| ------------------------- | -------------------------------------- |
| `npm start`               | (Raíz) Inicia el servidor backend      |
| `npm run dev`             | (Raíz) Backend con reinicio automático |
| `cd frontend && ng serve` | Inicia el servidor del frontend        |
