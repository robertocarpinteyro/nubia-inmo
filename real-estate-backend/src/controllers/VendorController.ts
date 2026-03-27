import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { VendorProperty } from "../models/VendorProperty";
import { Property } from "../models/Property";
import { PropertyMedia } from "../models/PropertyMedia";

// 📌 ASSIGN PROPERTY — Vendedor selecciona una propiedad para trabajar
export const assignProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // propertyId
    const userId = req.user!.id;

    // Verificar que la propiedad existe
    const property = await Property.findByPk(id);
    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    // Verificar que no esté ya asignada a este vendedor
    const existing = await VendorProperty.findOne({
      where: { userId, propertyId: id },
    });

    if (existing) {
      res.status(400).json({ error: "Ya estás trabajando en esta propiedad" });
      return;
    }

    const assignment = await VendorProperty.create({
      userId,
      propertyId: Number(id),
      status: "activa",
      assignedAt: new Date(),
    });

    res.status(201).json({ message: "Propiedad asignada exitosamente", assignment });
  } catch (error) {
    console.error("Assign Property Error:", error);
    res.status(500).json({ error: "Error al asignar propiedad" });
  }
};

// 📌 GET MY PROPERTIES — Vendedor ve sus propiedades asignadas
export const getMyProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const assignments = await VendorProperty.findAll({
      where: { userId },
      include: [
        {
          model: Property,
          include: [
            { model: PropertyMedia, as: "media" },
          ],
        },
      ],
      order: [["assignedAt", "DESC"]],
    });

    res.json(assignments);
  } catch (error) {
    console.error("Get Vendor Properties Error:", error);
    res.status(500).json({ error: "Error al obtener propiedades" });
  }
};

// 📌 GET COMMISSION — Vendedor ve la comisión de una propiedad
export const getPropertyCommission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // propertyId
    const userId = req.user!.id;

    // Verificar que está asignado a esta propiedad
    const assignment = await VendorProperty.findOne({
      where: { userId, propertyId: id },
      include: [{ model: Property }],
    });

    if (!assignment) {
      res.status(404).json({ error: "No estás asignado a esta propiedad" });
      return;
    }

    const property = assignment.property!;
    const commissionAmount = (Number(property.price) * Number(property.commissionPercentage)) / 100;

    res.json({
      propertyId: property.id,
      title: property.title,
      price: property.price,
      commissionPercentage: property.commissionPercentage,
      commissionAmount,
      currency: property.currency,
    });
  } catch (error) {
    console.error("Get Commission Error:", error);
    res.status(500).json({ error: "Error al obtener comisión" });
  }
};

// 📌 UPDATE ASSIGNMENT STATUS — Vendedor actualiza el estado (activa/pausada)
export const updateAssignmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // propertyId
    const userId = req.user!.id;
    const { status, notes } = req.body;

    const validStatuses = ["activa", "pausada", "completada"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Estado inválido. Usa: activa, pausada, completada" });
      return;
    }

    const assignment = await VendorProperty.findOne({
      where: { userId, propertyId: id },
    });

    if (!assignment) {
      res.status(404).json({ error: "No estás asignado a esta propiedad" });
      return;
    }

    await assignment.update({ status, ...(notes !== undefined && { notes }) });
    res.json({ message: "Estado actualizado exitosamente", assignment });
  } catch (error) {
    console.error("Update Assignment Error:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};

// 📌 UNASSIGN PROPERTY — Vendedor deja de trabajar una propiedad
export const unassignProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // propertyId
    const userId = req.user!.id;

    const assignment = await VendorProperty.findOne({
      where: { userId, propertyId: id },
    });

    if (!assignment) {
      res.status(404).json({ error: "No estás asignado a esta propiedad" });
      return;
    }

    await assignment.destroy();
    res.json({ message: "Propiedad desasignada exitosamente" });
  } catch (error) {
    console.error("Unassign Property Error:", error);
    res.status(500).json({ error: "Error al desasignar propiedad" });
  }
};
