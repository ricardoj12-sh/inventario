const redisClient = require("../config/redis"); // Importar cliente Redis
const products = [
  { id: "671dbfc36de002a504bcb131", views: 15 },
  { id: "671dc00894991af965aab40b", views: 12 },
  { id: "671dc00894991af965aab40c", views: 25 },
  { id: "67393fb2ba8e6444bb550b0d", views: 20 },
  { id: "672bec7acd27662d2ef5cb61", views: 100 },
  { id: "671dc00894991af965aab40d", views: 10 },
  { id: "673940e94a78b24d35437a6b", views: 35 },
  { id: "672bec7acd27662d2ef5cb60", views: 3 },
  { id: "6732987c71270e189ba94463", views: 2 },
  { id: "672bec7acd27662d2ef5cb63", views: 1 },
];

const simulateSearches = async () => {
  for (const product of products) {
    for (let i = 0; i < product.views; i++) {
      // Incrementar el contador de vistas
      const views = await redisClient.incr(`product_views:${product.id}`);

      // Actualizar el conjunto de productos más vistos
      await redisClient.zAdd("most_viewed_products", {
        score: views,
        value: product.id,
      });
    }
  }

  console.log("Simulación completada. Contadores actualizados.");
};

simulateSearches();
