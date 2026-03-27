import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { Permission } from "../models/Permission";

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

/**
 * Middleware extensible de permisos.
 * Consulta la tabla `permissions` para verificar si un rol tiene una habilidad específica.
 * Uso: checkPermission("manage_properties")
 * 
 * Si el permiso no existe en la tabla, se deniega por defecto.
 * Esto permite agregar nuevas "habilidades" a cada rol sin modificar código.
 */
export const checkPermission = (permissionKey: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    // Admin siempre tiene acceso
    if (req.user.role === "admin") {
      next();
      return;
    }

    try {
      const permission = await Permission.findOne({
        where: {
          role: req.user.role,
          permission: permissionKey,
          isEnabled: true,
        },
      });

      if (!permission) {
        res.status(403).json({ error: "No tienes el permiso: " + permissionKey });
        return;
      }

      next();
    } catch (error) {
      console.error("Permission Check Error:", error);
      res.status(500).json({ error: "Error al verificar permisos" });
    }
  };
};
