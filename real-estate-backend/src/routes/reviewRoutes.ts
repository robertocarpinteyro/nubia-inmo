import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  createReview,
  getPropertyReviews,
  getMyReviews,
  deleteReview,
  toggleReviewVisibility,
} from "../controllers/ReviewController";

const router = Router();

// 📌 Públicas
router.get("/property/:propertyId", getPropertyReviews);

// 📌 Autenticado (cualquier rol)
router.post("/", authenticateUser, createReview);
router.get("/me", authenticateUser, getMyReviews);
router.delete("/:id", authenticateUser, deleteReview);

// 📌 Solo admin
router.put("/:id/visibility", authenticateUser, requireRole("admin"), toggleReviewVisibility);

export default router;
