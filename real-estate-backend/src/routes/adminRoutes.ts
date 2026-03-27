import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  createVendor,
  deactivateUser,
  reactivateUser,
  getAllUsers,
  markUserAsPurchased,
  getAllVendors,
  updateVendorCommission,
  assignPropertyToVendor,
  removePropertyFromVendor,
  getEconomyDashboard,
} from "../controllers/AdminController";

const router = Router();

// 📌 Todas las rutas requieren autenticación + rol admin
router.use(authenticateUser, requireRole("admin"));

// Gestión de personal
router.post("/vendors", createVendor);
router.put("/users/:id/deactivate", deactivateUser);
router.put("/users/:id/reactivate", reactivateUser);

// Gestión de usuarios
router.get("/users", getAllUsers);
router.put("/users/:id/purchased", markUserAsPurchased);

// Gestión de vendedores
router.get("/vendors", getAllVendors);
router.put("/vendors/:vendorId/properties/:propertyId/commission", updateVendorCommission);
router.post("/vendors/:vendorId/properties/:propertyId", assignPropertyToVendor);
router.delete("/vendors/:vendorId/properties/:propertyId", removePropertyFromVendor);

// Dashboard economía
router.get("/economy", getEconomyDashboard);

export default router;
