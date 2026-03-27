import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  assignProperty,
  getMyProperties,
  getPropertyCommission,
  updateAssignmentStatus,
  unassignProperty,
} from "../controllers/VendorController";

const router = Router();

// 📌 Todas las rutas requieren autenticación + rol vendedor
router.use(authenticateUser, requireRole("vendedor", "admin"));

router.get("/properties", getMyProperties);
router.post("/properties/:id", assignProperty);
router.put("/properties/:id", updateAssignmentStatus);
router.delete("/properties/:id", unassignProperty);
router.get("/commission/:id", getPropertyCommission);

export default router;
