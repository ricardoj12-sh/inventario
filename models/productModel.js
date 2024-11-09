// models/productModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  stockQuantity: { type: Number, required: true, min: 0 },
  supplier: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
  },
  dateAdded: { type: Date, default: Date.now },
  status: { type: String, enum: ["available", "pending", "out_of_stock"], default: "available" },
  tags: [String],
  images: [String],
});

// Método para buscar productos por nombre o categoría
productSchema.statics.searchProducts = function (query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ],
  });
};

// Método para agregar productos por categoría
productSchema.statics.aggregateByCategory = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$category",
        totalProducts: { $sum: 1 },
        averagePrice: { $avg: "$price" },
      },
    },
  ]);
};

module.exports = mongoose.model("Product", productSchema);
