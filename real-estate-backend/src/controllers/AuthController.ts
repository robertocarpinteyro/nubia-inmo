import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/authMiddleware";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// 📌 1️⃣ SIGNUP — Registro de nuevo usuario con rol
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, termsAccepted, role } = req.body;

    if (!termsAccepted) {
      res.status(400).json({ error: "Debes aceptar los términos y condiciones" });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "El usuario ya existe" });
      return;
    }

    // Validar rol (solo admin, vendedor, usuario)
    const validRoles = ["admin", "vendedor", "usuario"];
    const userRole = validRoles.includes(role) ? role : "usuario";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      termsAccepted,
      role: userRole,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario creado exitosamente",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Error al crear usuario", details: error });
  }
};

// 📌 2️⃣ LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // ✅ JWT con id y rol
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// 📌 3️⃣ GET ME — Obtener usuario autenticado
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "firstName", "lastName", "phoneNumber", "about", "avatarUrl"],
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};
