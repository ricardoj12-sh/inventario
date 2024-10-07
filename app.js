const mongoose = require('mongoose');
const Product = require('./productModel');  


mongoose.connect('mongodb://localhost:27017/inventoryDB')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));


const newProduct = new Product({
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
});

newProduct.save()
    .then(() => console.log('Producto guardado exitosamente'))
    .catch(err => console.error('Error al guardar el producto:', err));
