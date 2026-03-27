import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { VendorProperty } from "../models/VendorProperty";
import { Property } from "../models/Property";
import { PropertyMedia } from "../models/PropertyMedia";
import { AiChatMessage } from "../models/AiChatMessage";
import { User } from "../models/User";
import { sequelize } from "../config/database";

// ═══════════════════════════════════════════
// 📌 FUNCIONES EXISTENTES (MANTENIDAS)
// ═══════════════════════════════════════════

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
      vendorCommission: property.commissionPercentage || 4.00,
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
    const commissionAmount = (Number(property.price) * Number(assignment.vendorCommission)) / 100;

    res.json({
      propertyId: property.id,
      title: property.title,
      price: property.price,
      baseCommission: property.commissionPercentage,
      vendorCommission: assignment.vendorCommission,
      isExclusive: assignment.isExclusive,
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

// ═══════════════════════════════════════════
// 📌 NUEVAS FUNCIONES DEL SISTEMA DE ROLES
// ═══════════════════════════════════════════

// 📌 GET AVAILABLE PROPERTIES — Vendedor ve propiedades disponibles con info de comisión
export const getAvailableProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const properties = await Property.findAll({
      where: { status: "disponible" },
      include: [
        { model: PropertyMedia, as: "media" },
        {
          model: VendorProperty,
          as: "vendorAssignments",
          attributes: ["id", "userId", "isExclusive", "vendorCommission", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Enriquecer con datos del vendedor
    const enriched = properties.map((prop) => {
      const propData = prop.toJSON() as any;
      const vendorCount = propData.vendorAssignments?.filter(
        (vp: any) => vp.status === "activa"
      ).length || 0;
      const isAssigned = propData.vendorAssignments?.some(
        (vp: any) => vp.userId === userId
      ) || false;
      const hasExclusivity = propData.vendorAssignments?.some(
        (vp: any) => vp.isExclusive
      ) || false;

      return {
        ...propData,
        vendorCount,
        isAssigned,
        hasExclusivity,
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("Get Available Properties Error:", error);
    res.status(500).json({ error: "Error al obtener propiedades disponibles" });
  }
};

// 📌 GET PROPERTY FULL DETAIL — Vendedor ve detalle completo
export const getPropertyFullDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verificar que está asignado
    const assignment = await VendorProperty.findOne({
      where: { userId, propertyId: id },
    });

    if (!assignment) {
      res.status(403).json({ error: "Debes estar asignado a esta propiedad para ver el detalle completo" });
      return;
    }

    const property = await Property.findByPk(id, {
      include: [
        { model: PropertyMedia, as: "media" },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        {
          model: VendorProperty,
          as: "vendorAssignments",
          attributes: ["id", "userId", "isExclusive", "status"],
          include: [
            { model: User, attributes: ["id", "name"] },
          ],
        },
      ],
    });

    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    const propData = property.toJSON() as any;

    // Parsear campos JSON
    let videoUrls = [];
    let technicalSheet = {};
    try { videoUrls = propData.videoUrls ? JSON.parse(propData.videoUrls) : []; } catch (e) { }
    try { technicalSheet = propData.technicalSheet ? JSON.parse(propData.technicalSheet) : {}; } catch (e) { }

    res.json({
      ...propData,
      videoUrls,
      technicalSheet,
      vendorAssignment: {
        vendorCommission: assignment.vendorCommission,
        isExclusive: assignment.isExclusive,
        status: assignment.status,
        assignedAt: assignment.assignedAt,
      },
      vendorCount: propData.vendorAssignments?.filter((vp: any) => vp.status === "activa").length || 0,
    });
  } catch (error) {
    console.error("Get Property Full Detail Error:", error);
    res.status(500).json({ error: "Error al obtener detalle de propiedad" });
  }
};

// 📌 REQUEST EXCLUSIVITY — Vendedor solicita exclusividad (sube comisión)
export const requestExclusivity = async (req: AuthRequest, res: Response): Promise<void> => {
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

    if (assignment.isExclusive) {
      res.status(400).json({ error: "Ya tienes exclusividad en esta propiedad" });
      return;
    }

    // Exclusividad sube la comisión a 5% (1% más que la base de 4%)
    const exclusiveCommission = Number(assignment.vendorCommission) + 1;

    await assignment.update({
      isExclusive: true,
      vendorCommission: exclusiveCommission,
    });

    res.json({
      message: "Exclusividad activada. Tu comisión ahora es " + exclusiveCommission + "%",
      assignment,
    });
  } catch (error) {
    console.error("Request Exclusivity Error:", error);
    res.status(500).json({ error: "Error al solicitar exclusividad" });
  }
};

// 📌 SEND AI CHAT MESSAGE — Placeholder
export const sendAiChatMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { propertyId, message } = req.body;

    if (!message) {
      res.status(400).json({ error: "El mensaje es obligatorio" });
      return;
    }

    // Placeholder: respuesta automática básica
    const placeholderResponse = `[AI Placeholder] Recibí tu consulta: "${message}". Esta funcionalidad será implementada próximamente con un agente AI real.`;

    const chatMessage = await AiChatMessage.create({
      userId,
      propertyId: propertyId || null,
      message,
      response: placeholderResponse,
    });

    res.json({
      message: "Mensaje enviado",
      chat: chatMessage,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Error en chat AI" });
  }
};

// 📌 GET AI CHAT HISTORY — Placeholder
export const getAiChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.query;

    const where: any = { userId };
    if (propertyId) where.propertyId = propertyId;

    const messages = await AiChatMessage.findAll({
      where,
      include: [
        {
          model: Property,
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error("Get AI Chat Error:", error);
    res.status(500).json({ error: "Error al obtener historial de chat" });
  }
};
