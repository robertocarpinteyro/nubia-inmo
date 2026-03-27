import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Sale } from "../models/Sale";
import { Property } from "../models/Property";
import { User } from "../models/User";
import { VendorProperty } from "../models/VendorProperty";
import { Op } from "sequelize";

// 📌 REGISTER SALE — Admin registra venta
export const registerSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, vendorId, buyerUserId, salePrice, commissionPercentage, saleDate, notes } = req.body;

    if (!propertyId || !vendorId || !salePrice) {
      res.status(400).json({ error: "propertyId, vendorId y salePrice son obligatorios" });
      return;
    }

    // Verificar propiedad
    const property = await Property.findByPk(propertyId);
    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    // Verificar vendedor
    const vendor = await User.findByPk(vendorId);
    if (!vendor || vendor.role !== "vendedor") {
      res.status(404).json({ error: "Vendedor no encontrado" });
      return;
    }

    // Calcular comisión
    const finalCommissionPct = commissionPercentage || property.commissionPercentage || 4.00;
    const commissionAmount = (Number(salePrice) * Number(finalCommissionPct)) / 100;

    const sale = await Sale.create({
      propertyId,
      vendorId,
      buyerUserId: buyerUserId || null,
      salePrice,
      commissionPercentage: finalCommissionPct,
      commissionAmount,
      saleDate: saleDate || new Date().toISOString().split("T")[0],
      notes,
    });

    // Marcar propiedad como vendida
    await property.update({ status: "vendida" });

    // Marcar comprador como hasPurchased si es usuario registrado
    if (buyerUserId) {
      await User.update({ hasPurchased: true }, { where: { id: buyerUserId } });
    }

    // Incrementar contador del vendedor
    const assignment = await VendorProperty.findOne({
      where: { userId: vendorId, propertyId },
    });
    if (assignment) {
      await assignment.update({
        propertiesSold: assignment.propertiesSold + 1,
        status: "completada",
      });
    }

    res.status(201).json({ message: "Venta registrada exitosamente", sale });
  } catch (error) {
    console.error("Register Sale Error:", error);
    res.status(500).json({ error: "Error al registrar venta" });
  }
};

// 📌 GET SALES — Admin ve historial
export const getSales = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, vendorId } = req.query;

    const where: any = {};
    if (vendorId) where.vendorId = vendorId;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Sale.findAndCountAll({
      where,
      include: [
        {
          model: Property,
          attributes: ["id", "title", "price", "city", "state"],
        },
        {
          model: User,
          as: "vendor",
          attributes: ["id", "name", "email"],
        },
      ],
      limit: Number(limit),
      offset,
      order: [["saleDate", "DESC"]],
    });

    res.json({
      sales: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get Sales Error:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

// 📌 GET VENDOR SALES — Vendedor ve sus ventas
export const getVendorSales = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendorId = req.user!.id;

    const sales = await Sale.findAll({
      where: { vendorId },
      include: [
        {
          model: Property,
          attributes: ["id", "title", "price", "city", "state"],
        },
      ],
      order: [["saleDate", "DESC"]],
    });

    // Calcular totales
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.salePrice), 0);
    const totalCommissions = sales.reduce((sum, s) => sum + Number(s.commissionAmount), 0);

    res.json({
      sales,
      summary: {
        totalSales,
        totalRevenue,
        totalCommissions,
      },
    });
  } catch (error) {
    console.error("Get Vendor Sales Error:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};
