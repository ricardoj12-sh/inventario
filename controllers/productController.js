const redisClient = require("../config/redis"); // Importamos el cliente Redis
const Product = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    // Verificar si los productos están en caché
    const cachedProducts = await redisClient.get("products");
    if (cachedProducts) {
      return res.status(200).json(JSON.parse(cachedProducts)); // Devuelve productos desde la caché
    }

    // Si no están en caché, consultar la base de datos
    const products = await Product.find();

    // Almacenar los productos en la caché durante 1 hora
    await redisClient.set("products", JSON.stringify(products), {
      EX: 3600, // Expira en 1 hora
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el producto está en caché
    const cachedProduct = await redisClient.get(`product:${id}`);
    if (cachedProduct) {
      return res.status(200).json(JSON.parse(cachedProduct));
    }

    // Si no está en caché, consultar la base de datos
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Almacenar el producto en la caché durante 30 minutos
    await redisClient.set(`product:${id}`, JSON.stringify(product), {
      EX: 1800, // Expira en 30 minutos
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Limpiar la caché de productos al crear un nuevo producto
    await redisClient.del("products");

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Actualizar el producto en la caché
    await redisClient.set(`product:${req.params.id}`, JSON.stringify(product), {
      EX: 1800, // Expira en 30 minutos
    });

    // Limpiar la caché de productos al actualizar uno
    await redisClient.del("products");

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Eliminar el producto de la caché
    await redisClient.del(`product:${req.params.id}`);

    // Limpiar la caché de productos al eliminar uno
    await redisClient.del("products");

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.aggregateByCategory = async (req, res) => {
  try {
    const results = await Product.aggregateByCategory();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
