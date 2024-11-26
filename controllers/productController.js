const redisClient = require("../config/redis"); // Importamos el cliente Redis
const Product = require("../models/productModel");

// Obtener todos los productos
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

// Obtener un producto por ID y actualizar sus vistas
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el producto está en caché
    const cachedProduct = await redisClient.get(`product:${id}`);
    if (cachedProduct) {
      await incrementProductViews(id); // Incrementar el contador de vistas
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

    await incrementProductViews(id); // Incrementar el contador de vistas

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Incrementar vistas de un producto
const incrementProductViews = async (productId) => {
  const viewsKey = `product_views:${productId}`;
  const views = await redisClient.incr(viewsKey); // Incrementa el contador

  // Si el contador alcanza un umbral, añadir a productos más consultados
  const threshold = 1; // Incrementar en cualquier consulta
  if (views >= threshold) {
    await redisClient.zadd("most_viewed_products", views, productId);
  }

  // Configurar la expiración del contador de vistas
  await redisClient.expire(viewsKey, 3600); // Expira en 1 hora
};

// Obtener los 10 productos más consultados
exports.getMostViewedProducts = async (req, res) => {
  try {
    // Recuperar los productos más consultados de Redis
    const topProducts = await redisClient.zrevrange(
      "most_viewed_products",
      0,
      9,
      "WITHSCORES"
    );

    const products = [];
    for (let i = 0; i < topProducts.length; i += 2) {
      const productId = topProducts[i];
      const score = topProducts[i + 1];
      const product = await Product.findById(productId);
      if (product) {
        products.push({ product, views: score });
      }
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un producto
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

// Eliminar un producto
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

// Agregar agregación por categoría
exports.aggregateByCategory = async (req, res) => {
  try {
    const results = await Product.aggregateByCategory();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Limpiar la caché global de productos
    await redisClient.del("products");

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

