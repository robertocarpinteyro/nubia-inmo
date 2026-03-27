import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  registerSale,
  getSales,
  getVendorSales,
} from "../controllers/SaleController";

const router = Router();

// 📌 Admin — registrar y ver ventas
router.post("/", authenticateUser, requireRole("admin"), registerSale);
router.get("/", authenticateUser, requireRole("admin"), getSales);

// 📌 Vendedor — ver sus ventas
router.get("/vendor", authenticateUser, requireRole("vendedor"), getVendorSales);

export default router;
