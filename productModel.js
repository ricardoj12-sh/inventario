const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    supplier: {
        name: { type: String, required: true },
        contact: { type: String, required: true }
    },
    dateAdded: { type: Date, default: Date.now },
    status: { type: String, enum: ['available', 'pending', 'out_of_stock'], default: 'available' },
    tags: [String],
    images: [String]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
