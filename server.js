require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const redisClient = require("./config/redis");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const simulateSearches = require("./scripts/simulateSearches"); // Importar el script de simulación

connectDB();
const app = express();

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", productRoutes);

// Ruta para ejecutar la simulación de búsquedas
app.get("/api/simulate", async (req, res) => {
  try {
    await simulateSearches();
    res.status(200).send("Simulación completada.");
  } catch (error) {
    console.error("Error durante la simulación:", error);
    res.status(500).send("Error en la simulación.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
