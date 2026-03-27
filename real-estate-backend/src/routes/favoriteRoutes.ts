import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} from "../controllers/FavoriteController";

const router = Router();

// 📌 Todas las rutas requieren autenticación (cualquier rol)
router.use(authenticateUser);

router.get("/", getMyFavorites);
router.post("/:propertyId", addFavorite);
router.delete("/:propertyId", removeFavorite);

export default router;
