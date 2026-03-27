import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database";
import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 📌 Rutas
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/favorites", favoriteRoutes);

// 📌 Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "Nubia API", version: "1.0.0" });
});

// 📌 Conexión a base de datos y arranque del servidor
sequelize.sync({ alter: true }).then(() => {
  console.log("📌 Database connected & synced!");
  app.listen(PORT, () => console.log(`🚀 Nubia API running on port ${PORT}`));
}).catch((error) => {
  console.error("❌ Database connection error:", error);
});
