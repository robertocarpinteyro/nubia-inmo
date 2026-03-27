import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  createLead,
  getMyLeads,
  getAllLeads,
  updateLeadStatus,
  assignLeadToVendor,
} from "../controllers/LeadController";

const router = Router();

// 📌 Vendedor — crear y ver sus leads
router.post("/", authenticateUser, requireRole("vendedor", "admin"), createLead);
router.get("/me", authenticateUser, requireRole("vendedor"), getMyLeads);
router.put("/:id/status", authenticateUser, requireRole("vendedor", "admin"), updateLeadStatus);

// 📌 Admin — ver todos y asignar
router.get("/", authenticateUser, requireRole("admin"), getAllLeads);
router.put("/:id/assign", authenticateUser, requireRole("admin"), assignLeadToVendor);

export default router;
