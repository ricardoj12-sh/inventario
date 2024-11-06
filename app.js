// app.js
const mongoose = require('mongoose');
const Product = require('./productModel');  

mongoose.connect('mongodb://localhost:27017/inventoryDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Crear productos de ejemplo
async function createProducts() {
    const products = [
        {
            name: 'Laptop',
            category: 'Electronics',
            price: 799.99,
            description: 'Laptop de 15 pulgadas con 256GB SSD y 8GB RAM',
            stockQuantity: 50,
            supplier: {
                name: 'TechSupplier Inc.',
                contact: 'techsupplier@example.com'
            },
            tags: ['laptop', 'electronics', 'computer'],
            images: ['https://example.com/laptop.jpg']
        },
        {
            name: 'Smartphone',
            category: 'Electronics',
            price: 499.99,
            description: 'Smartphone de última generación con cámara de 108MP',
            stockQuantity: 100,
            supplier: {
                name: 'PhoneSupplier LLC',
                contact: 'phonesupplier@example.com'
            },
            tags: ['smartphone', 'electronics', 'mobile'],
            images: ['https://example.com/smartphone.jpg']
        },
        {
            name: 'Tableta',
            category: 'Electronics',
            price: 299.99,
            description: 'Tableta de 10 pulgadas con pantalla retina',
            stockQuantity: 75,
            supplier: {
                name: 'TabletSupplier Co.',
                contact: 'tabletsupplier@example.com'
            },
            tags: ['tablet', 'electronics', 'device'],
            images: ['https://example.com/tablet.jpg']
        },
        {
            name: 'Cámara DSLR',
            category: 'Photography',
            price: 899.99,
            description: 'Cámara DSLR con lente de 18-55mm',
            stockQuantity: 30,
            supplier: {
                name: 'CameraSupplier Inc.',
                contact: 'camerasupplier@example.com'
            },
            tags: ['camera', 'photography', 'dslr'],
            images: ['https://example.com/camera.jpg']
        }
    ];

    await Product.insertMany(products);
    console.log('Productos guardados exitosamente');
}

// Ejecutar la creación de productos
createProducts().catch(err => console.error('Error al crear productos:', err));

// Función para buscar productos
async function searchProducts(query) {
    const products = await Product.searchProducts(query);
    console.log('Productos encontrados:', products);
}

// Función para agregar productos
async function aggregateByCategory() {
    const results = await Product.aggregateByCategory();
    console.log('Agregación por categoría:', results);
}

// Realizar una búsqueda y una agregación después de crear los productos
setTimeout(() => {
    searchProducts('Electronics'); // Busca productos en la categoría 'Electronics'
    aggregateByCategory(); // Agrega productos por categoría
}, 2000);
