import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  scheduleVisit,
  getMyVisits,
  cancelVisit,
  getVisitsByProperty,
  updateVisitStatus,
  getAllVisits,
} from "../controllers/VisitController";

const router = Router();

// 📌 Usuario — agendar y ver sus visitas
router.post("/", authenticateUser, scheduleVisit);
router.get("/me", authenticateUser, getMyVisits);
router.put("/:id/cancel", authenticateUser, cancelVisit);

// 📌 Admin — ver y gestionar visitas
router.get("/", authenticateUser, requireRole("admin"), getAllVisits);
router.get("/property/:propertyId", authenticateUser, requireRole("admin"), getVisitsByProperty);
router.put("/:id/status", authenticateUser, requireRole("admin"), updateVisitStatus);

export default router;
