import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Lead } from "../models/Lead";
import { Property } from "../models/Property";
import { User } from "../models/User";
import { Op } from "sequelize";

// 📌 CREATE LEAD — Vendedor o sistema web
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, source, propertyId, notes, vendorId } = req.body;

    if (!name) {
      res.status(400).json({ error: "El nombre del lead es obligatorio" });
      return;
    }

    // Si se especifica propiedad, verificar que exista
    if (propertyId) {
      const property = await Property.findByPk(propertyId);
      if (!property) {
        res.status(404).json({ error: "Propiedad no encontrada" });
        return;
      }
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      source: source || "manual",
      propertyId,
      notes,
      vendorId: vendorId || (req.user!.role === "vendedor" ? req.user!.id : null),
      createdBy: req.user!.id,
    });

    res.status(201).json({ message: "Lead creado exitosamente", lead });
  } catch (error) {
    console.error("Create Lead Error:", error);
    res.status(500).json({ error: "Error al crear lead" });
  }
};

// 📌 GET MY LEADS — Vendedor ve sus leads
export const getMyLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { status, search } = req.query;

    const where: any = { vendorId: userId };
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const leads = await Lead.findAll({
      where,
      include: [
        {
          model: Property,
          attributes: ["id", "title", "price", "city"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(leads);
  } catch (error) {
    console.error("Get My Leads Error:", error);
    res.status(500).json({ error: "Error al obtener leads" });
  }
};

// 📌 GET ALL LEADS — Admin ve todos
export const getAllLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Lead.findAndCountAll({
      where,
      include: [
        {
          model: Property,
          attributes: ["id", "title", "price"],
        },
        {
          model: User,
          as: "vendor",
          attributes: ["id", "name", "email"],
        },
      ],
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      leads: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get All Leads Error:", error);
    res.status(500).json({ error: "Error al obtener leads" });
  }
};

// 📌 UPDATE LEAD STATUS — Vendedor actualiza estado
export const updateLeadStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ["nuevo", "contactado", "en_proceso", "cerrado", "perdido"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Estado inválido" });
      return;
    }

    const lead = await Lead.findByPk(id);
    if (!lead) {
      res.status(404).json({ error: "Lead no encontrado" });
      return;
    }

    // Vendedor solo puede editar sus propios leads
    if (req.user!.role === "vendedor" && lead.vendorId !== req.user!.id) {
      res.status(403).json({ error: "No tienes acceso a este lead" });
      return;
    }

    await lead.update({ status, ...(notes !== undefined && { notes }) });
    res.json({ message: "Lead actualizado exitosamente", lead });
  } catch (error) {
    console.error("Update Lead Error:", error);
    res.status(500).json({ error: "Error al actualizar lead" });
  }
};

// 📌 ASSIGN LEAD TO VENDOR — Admin asigna
export const assignLeadToVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { vendorId } = req.body;

    const lead = await Lead.findByPk(id);
    if (!lead) {
      res.status(404).json({ error: "Lead no encontrado" });
      return;
    }

    const vendor = await User.findByPk(vendorId);
    if (!vendor || vendor.role !== "vendedor") {
      res.status(404).json({ error: "Vendedor no encontrado" });
      return;
    }

    await lead.update({ vendorId });
    res.json({ message: "Lead asignado a vendedor exitosamente", lead });
  } catch (error) {
    console.error("Assign Lead Error:", error);
    res.status(500).json({ error: "Error al asignar lead" });
  }
};
