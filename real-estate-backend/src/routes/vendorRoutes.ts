import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  assignProperty,
  getMyProperties,
  getPropertyCommission,
  updateAssignmentStatus,
  unassignProperty,
  getAvailableProperties,
  getPropertyFullDetail,
  requestExclusivity,
  sendAiChatMessage,
  getAiChatHistory,
} from "../controllers/VendorController";

const router = Router();

// 📌 Todas las rutas requieren autenticación + rol vendedor (o admin)
router.use(authenticateUser, requireRole("vendedor", "admin"));

// Funciones existentes
router.get("/properties", getMyProperties);
router.post("/properties/:id", assignProperty);
router.put("/properties/:id", updateAssignmentStatus);
router.delete("/properties/:id", unassignProperty);
router.get("/commission/:id", getPropertyCommission);

// 📌 Nuevas funciones del sistema de roles
router.get("/available-properties", getAvailableProperties);
router.get("/properties/:id/detail", getPropertyFullDetail);
router.put("/properties/:id/exclusivity", requestExclusivity);

// 📌 AI Chat (placeholder)
router.post("/ai-chat", sendAiChatMessage);
router.get("/ai-chat", getAiChatHistory);

export default router;
