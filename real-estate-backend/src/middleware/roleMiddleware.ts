import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

/**
 * Middleware que restringe el acceso según el rol del usuario.
 * Uso: requireRole("admin") o requireRole("admin", "vendedor")
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
      return;
    }

    next();
  };
};
