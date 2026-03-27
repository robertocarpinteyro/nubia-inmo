import express from "express";
import { signup, login, getMe } from "../controllers/AuthController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateUser, getMe);

export default router;
