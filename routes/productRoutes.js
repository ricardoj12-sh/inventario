const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Asegúrate de que las funciones existan en `productController`
if (
  !productController.createProduct ||
  !productController.getProducts ||
  !productController.updateProduct ||
  !productController.getProductById ||
  !productController.deleteProduct ||
  !productController.aggregateByCategory ||
  !productController.getMostViewedProducts
) {
  throw new Error("Uno o más métodos de productController no están definidos");
}

// Rutas de productos
router.post("/products", productController.createProduct); // Crear producto
router.get("/products", productController.getProducts); // Listar productos
router.get("/products/most-viewed", productController.getMostViewedProducts); // Más vistos
router.put("/products/:id", productController.updateProduct); // Actualizar producto
router.get("/products/:id", productController.getProductById); // Obtener producto por ID
router.delete("/products/:id", productController.deleteProduct); // Eliminar producto
router.get("/products/aggregate/category", productController.aggregateByCategory); // Agregar por categoría

module.exports = router;
