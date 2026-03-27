import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  uploadMedia,
  deleteMedia,
} from "../controllers/PropertyController";

const router = Router();

// 📌 Públicas
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// 📌 Solo admin
router.post("/", authenticateUser, requireRole("admin"), createProperty);
router.put("/:id", authenticateUser, requireRole("admin"), updateProperty);
router.delete("/:id", authenticateUser, requireRole("admin"), deleteProperty);

// 📌 Media — Solo admin
router.post("/:id/media", authenticateUser, requireRole("admin"), uploadMedia);
router.delete("/:id/media/:mediaId", authenticateUser, requireRole("admin"), deleteMedia);

export default router;
