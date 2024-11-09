Sistema de Inventario

El sistema de gestión de inventarios desarrollado se basa en el uso de MongoDB como base de datos NoSQL para almacenar y gestionar los productos de manera eficiente. 

#Sistema de Inventario

Este sistema de inventario permite gestionar productos y usuarios, con funcionalidades como agregar, actualizar, consultar y eliminar productos, además de autenticación de usuarios.

##Estructura de la Base de Datos

###Colección products

| Campo         | Tipo             | Descripción                                        |
|---------------|------------------|----------------------------------------------------|
| name          | String           | Nombre del producto                                |
| category      | String           | Categoría del producto                             |
| price         | Number           | Precio del producto                                |
| description   | String           | Descripción detallada del producto                 |
| stockQuantity | Number           | Cantidad de productos en stock                     |
| supplier      | Object           | Información del proveedor (nombre, contacto)       |
| dateAdded     | Date             | Fecha en la que se agregó el producto              |
| status        | String (Enum)    | Estado del producto (`available`, `pending`, `out_of_stock`) |
| tags          | Array of Strings | Etiquetas de clasificación del producto            |
| images        | Array of Strings | URLs de las imágenes del producto                  |

###Colección users

| Campo         | Tipo             | Descripción                        |
|---------------|------------------|------------------------------------|
| name          | String           | Nombre del usuario                |
| email         | String           | Correo electrónico único           |
| password      | String           | Contraseña encriptada             |

##Endpoints de la API

###Usuarios

- **POST /api/users** - Crear un nuevo usuario
  - **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  
- **POST /api/users/login** - Autenticar un usuario
  - **Body**: `{ "email": "john@example.com", "password": "password123" }`
  
- **GET /api/users** - Obtener todos los usuarios
- **PUT /api/users/:id** - Actualizar un usuario por ID
  - **Body**: `{ "name": "Jane Doe" }`
  
- **DELETE /api/users/:id** - Eliminar un usuario por ID

###Productos

- **POST /api/products** - Agregar un nuevo producto
  - **Body**:
    ```json
    {
      "name": "Laptop",
      "category": "Electronics",
      "price": 799.99,
      "description": "Laptop de alta gama",
      "stockQuantity": 50,
      "supplier": {
        "name": "TechSupplier Inc.",
        "contact": "techsupplier@example.com"
      },
      "tags": ["laptop", "electronics"],
      "images": ["https://example.com/laptop.jpg"]
    }
    ```

- **GET /api/products** - Obtener todos los productos

- **GET /api/products/aggregate/category** - Agregar productos por categoría

- **PUT /api/products/:id** - Actualizar un producto por ID
  - **Body**: `{ "price": 850.99 }`

- **DELETE /api/products/:id** - Eliminar un producto por ID

###Ejemplos de consultas

####Crear un producto


curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{
  "name": "Smartphone",
  "category": "Electronics",
  "price": 499.99,
  "description": "Smartphone de última generación",
  "stockQuantity": 100,
  "supplier": {
    "name": "PhoneSupplier LLC",
    "contact": "phonesupplier@example.com"
  },
  "tags": ["smartphone", "electronics"],
  "images": ["https://example.com/smartphone.jpg"]
}'
##Obtener todos los productos

curl -X GET http://localhost:3000/api/products
Buscar productos por categoría o nombre

// Ejemplo en código
await Product.searchProducts('Electronics');

##Actualizar un producto


curl -X PUT http://localhost:3000/api/products/PRODUCT_ID -H "Content-Type: application/json" -d '{
  "price": 899.99
}'
Eliminar un producto

curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID
Instalación
Clona el repositorio.

Ejecuta npm install para instalar las dependencias.

Crea un archivo .env con las siguientes variables:

plaintext

MONGODB_URI=mongodb:
PORT=3000
JWT_SECRET
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
Inicia el servidor:

node server.js
---

Este `README.md` proporciona una descripción completa de la funcionalidad, estructura y ejemplo