import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";
import { VendorProperty } from "../models/VendorProperty";
import { Property } from "../models/Property";
import { Sale } from "../models/Sale";
import { Visit } from "../models/Visit";
import { Favorite } from "../models/Favorite";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { sequelize } from "../config/database";

// ═══════════════════════════════════════════
// 📌 GESTIÓN DE PERSONAL (VENDEDORES)
// ═══════════════════════════════════════════

// Crear vendedor — Solo admin puede dar de alta
export const createVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, firstName, lastName, phoneNumber } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "El email ya está registrado" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await User.create({
      name,
      email,
      password: hashedPassword,
      termsAccepted: true,
      role: "vendedor",
      firstName,
      lastName,
      phoneNumber,
      isActive: true,
    });

    res.status(201).json({
      message: "Vendedor creado exitosamente",
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        phoneNumber: vendor.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Create Vendor Error:", error);
    res.status(500).json({ error: "Error al crear vendedor", details: error });
  }
};

// Desactivar usuario/vendedor (soft delete)
export const deactivateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // No permitir desactivar a otro admin
    if (user.role === "admin" && req.user!.id !== user.id) {
      res.status(403).json({ error: "No puedes desactivar a otro admin" });
      return;
    }

    await user.update({ isActive: false });
    res.json({ message: "Usuario desactivado exitosamente" });
  } catch (error) {
    console.error("Deactivate User Error:", error);
    res.status(500).json({ error: "Error al desactivar usuario" });
  }
};

// Reactivar usuario/vendedor
export const reactivateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    await user.update({ isActive: true });
    res.json({ message: "Usuario reactivado exitosamente" });
  } catch (error) {
    console.error("Reactivate User Error:", error);
    res.status(500).json({ error: "Error al reactivar usuario" });
  }
};

// ═══════════════════════════════════════════
// 📌 GESTIÓN DE USUARIOS
// ═══════════════════════════════════════════

// Lista de usuarios con filtros
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filter, search, page = 1, limit = 20 } = req.query;

    const where: any = { role: "usuario" };

    // Filtros específicos
    if (filter === "agendaron") {
      // Usuarios que han agendado al menos una visita
      const usersWithVisits = await Visit.findAll({
        attributes: [[sequelize.fn("DISTINCT", sequelize.col("userId")), "userId"]],
        raw: true,
      });
      const userIds = usersWithVisits.map((v: any) => v.userId);
      where.id = { [Op.in]: userIds };
    } else if (filter === "compraron") {
      where.hasPurchased = true;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ["id", "name", "email", "firstName", "lastName", "phoneNumber", "isActive", "hasPurchased", "createdAt"],
      include: [
        { model: Visit, attributes: ["id", "propertyId", "status", "scheduledDate"] },
        { model: Favorite, attributes: ["id", "propertyId"] },
      ],
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      users: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Marcar usuario como comprador
export const markUserAsPurchased = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    await user.update({ hasPurchased: true });
    res.json({ message: "Usuario marcado como comprador exitosamente" });
  } catch (error) {
    console.error("Mark Purchased Error:", error);
    res.status(500).json({ error: "Error al marcar usuario" });
  }
};

// ═══════════════════════════════════════════
// 📌 GESTIÓN DE VENDEDORES
// ═══════════════════════════════════════════

// Lista de vendedores con estadísticas
export const getAllVendors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendors = await User.findAll({
      where: { role: "vendedor" },
      attributes: ["id", "name", "email", "firstName", "lastName", "phoneNumber", "isActive", "createdAt"],
      include: [
        {
          model: VendorProperty,
          include: [
            {
              model: Property,
              attributes: ["id", "title", "price", "status", "commissionPercentage"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Enriquecer con estadísticas
    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        const vendorData = vendor.toJSON() as any;

        // Propiedades activas ofertando
        const activeProperties = vendorData.vendorProperties?.filter(
          (vp: any) => vp.status === "activa"
        ).length || 0;

        // Propiedades vendidas (completadas)
        const soldProperties = vendorData.vendorProperties?.filter(
          (vp: any) => vp.status === "completada"
        ).length || 0;

        // Ventas registradas
        const salesData = await Sale.findAll({
          where: { vendorId: vendor.id },
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "totalSales"],
            [sequelize.fn("SUM", sequelize.col("commissionAmount")), "totalCommissions"],
            [sequelize.fn("SUM", sequelize.col("salePrice")), "totalSalesAmount"],
          ],
          raw: true,
        });

        const stats = salesData[0] as any;

        // Verificar exclusividad
        const hasExclusivity = vendorData.vendorProperties?.some(
          (vp: any) => vp.isExclusive
        ) || false;

        return {
          ...vendorData,
          stats: {
            activeProperties,
            soldProperties,
            totalSales: Number(stats?.totalSales) || 0,
            totalCommissions: Number(stats?.totalCommissions) || 0,
            totalSalesAmount: Number(stats?.totalSalesAmount) || 0,
            hasExclusivity,
          },
        };
      })
    );

    res.json(vendorsWithStats);
  } catch (error) {
    console.error("Get All Vendors Error:", error);
    res.status(500).json({ error: "Error al obtener vendedores" });
  }
};

// Ajustar comisión de un vendedor en una propiedad
export const updateVendorCommission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vendorId, propertyId } = req.params;
    const { commissionPercentage } = req.body;

    if (commissionPercentage === undefined || commissionPercentage < 0 || commissionPercentage > 100) {
      res.status(400).json({ error: "Porcentaje de comisión inválido (0-100)" });
      return;
    }

    const assignment = await VendorProperty.findOne({
      where: { userId: vendorId, propertyId },
    });

    if (!assignment) {
      res.status(404).json({ error: "Asignación de vendedor no encontrada" });
      return;
    }

    await assignment.update({ vendorCommission: commissionPercentage });
    res.json({ message: "Comisión actualizada exitosamente", assignment });
  } catch (error) {
    console.error("Update Commission Error:", error);
    res.status(500).json({ error: "Error al actualizar comisión" });
  }
};

// Admin asigna propiedad a vendedor
export const assignPropertyToVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vendorId, propertyId } = req.params;
    const { commissionPercentage = 4.00, isExclusive = false } = req.body;

    // Verificar que el usuario existe y es vendedor
    const vendor = await User.findByPk(vendorId);
    if (!vendor || vendor.role !== "vendedor") {
      res.status(404).json({ error: "Vendedor no encontrado" });
      return;
    }

    // Verificar propiedad
    const property = await Property.findByPk(propertyId);
    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    // Verificar duplicados
    const existing = await VendorProperty.findOne({
      where: { userId: vendorId, propertyId },
    });
    if (existing) {
      res.status(400).json({ error: "El vendedor ya tiene asignada esta propiedad" });
      return;
    }

    const assignment = await VendorProperty.create({
      userId: Number(vendorId),
      propertyId: Number(propertyId),
      status: "activa",
      assignedAt: new Date(),
      isExclusive,
      vendorCommission: commissionPercentage,
    });

    res.status(201).json({ message: "Propiedad asignada a vendedor exitosamente", assignment });
  } catch (error) {
    console.error("Assign Property To Vendor Error:", error);
    res.status(500).json({ error: "Error al asignar propiedad" });
  }
};

// Admin quita propiedad de vendedor
export const removePropertyFromVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { vendorId, propertyId } = req.params;

    const assignment = await VendorProperty.findOne({
      where: { userId: vendorId, propertyId },
    });

    if (!assignment) {
      res.status(404).json({ error: "Asignación no encontrada" });
      return;
    }

    await assignment.destroy();
    res.json({ message: "Propiedad removida del vendedor exitosamente" });
  } catch (error) {
    console.error("Remove Property From Vendor Error:", error);
    res.status(500).json({ error: "Error al remover propiedad" });
  }
};

// ═══════════════════════════════════════════
// 📌 DASHBOARD ECONÓMICO
// ═══════════════════════════════════════════

export const getEconomyDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Total de propiedades por estado
    const propertiesByStatus = await Property.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Ventas totales
    const salesSummary = await Sale.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalSales"],
        [sequelize.fn("SUM", sequelize.col("salePrice")), "totalRevenue"],
        [sequelize.fn("SUM", sequelize.col("commissionAmount")), "totalCommissions"],
      ],
      raw: true,
    });

    // Vendedores activos
    const activeVendors = await User.count({
      where: { role: "vendedor", isActive: true },
    });

    // Usuarios totales
    const totalUsers = await User.count({
      where: { role: "usuario" },
    });

    // Usuarios que han agendado visita
    const usersWithVisits = await Visit.count({
      distinct: true,
      col: "userId",
    });

    // Usuarios que han comprado
    const usersWithPurchases = await User.count({
      where: { role: "usuario", hasPurchased: true },
    });

    // Propiedades totales
    const totalProperties = await Property.count();

    // Visitas agendadas este mes
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const visitsThisMonth = await Visit.count({
      where: {
        createdAt: { [Op.gte]: startOfMonth },
      },
    });

    // Leads nuevos este mes
    const { Lead } = require("../models/Lead");
    const leadsThisMonth = await Lead.count({
      where: {
        createdAt: { [Op.gte]: startOfMonth },
      },
    });

    const stats = (salesSummary as any)[0];

    res.json({
      economy: {
        totalRevenue: Number(stats?.totalRevenue) || 0,
        totalCommissions: Number(stats?.totalCommissions) || 0,
        totalSales: Number(stats?.totalSales) || 0,
      },
      properties: {
        total: totalProperties,
        byStatus: propertiesByStatus,
      },
      people: {
        activeVendors,
        totalUsers,
        usersWithVisits,
        usersWithPurchases,
      },
      activity: {
        visitsThisMonth,
        leadsThisMonth,
      },
    });
  } catch (error) {
    console.error("Economy Dashboard Error:", error);
    res.status(500).json({ error: "Error al obtener datos económicos" });
  }
};
