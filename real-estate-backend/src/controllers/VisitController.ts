import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Visit } from "../models/Visit";
import { Property } from "../models/Property";
import { User } from "../models/User";

// 📌 SCHEDULE VISIT — Usuario agenda visita
export const scheduleVisit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { propertyId, scheduledDate, scheduledTime, notes } = req.body;

    if (!propertyId || !scheduledDate || !scheduledTime) {
      res.status(400).json({ error: "propertyId, scheduledDate y scheduledTime son obligatorios" });
      return;
    }

    // Verificar propiedad
    const property = await Property.findByPk(propertyId);
    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    // Calcular priorityScore basado en visitas existentes de la propiedad
    const existingVisits = await Visit.count({ where: { propertyId } });
    const priorityScore = existingVisits + 1;

    const visit = await Visit.create({
      userId,
      propertyId,
      scheduledDate,
      scheduledTime,
      notes,
      priorityScore,
      status: "pendiente",
    });

    res.status(201).json({ message: "Visita agendada exitosamente", visit });
  } catch (error) {
    console.error("Schedule Visit Error:", error);
    res.status(500).json({ error: "Error al agendar visita" });
  }
};

// 📌 GET MY VISITS — Usuario ve sus visitas
export const getMyVisits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const visits = await Visit.findAll({
      where: { userId },
      include: [
        {
          model: Property,
          attributes: ["id", "title", "address", "city", "state", "price"],
        },
      ],
      order: [["scheduledDate", "DESC"]],
    });

    res.json(visits);
  } catch (error) {
    console.error("Get My Visits Error:", error);
    res.status(500).json({ error: "Error al obtener visitas" });
  }
};

// 📌 CANCEL VISIT — Usuario cancela su visita
export const cancelVisit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const visit = await Visit.findOne({
      where: { id, userId },
    });

    if (!visit) {
      res.status(404).json({ error: "Visita no encontrada" });
      return;
    }

    if (visit.status === "completada") {
      res.status(400).json({ error: "No se puede cancelar una visita completada" });
      return;
    }

    await visit.update({ status: "cancelada" });
    res.json({ message: "Visita cancelada exitosamente" });
  } catch (error) {
    console.error("Cancel Visit Error:", error);
    res.status(500).json({ error: "Error al cancelar visita" });
  }
};

// 📌 GET VISITS BY PROPERTY — Admin ve visitas de una propiedad
export const getVisitsByProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;

    const visits = await Visit.findAll({
      where: { propertyId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phoneNumber", "hasPurchased"],
        },
      ],
      order: [["priorityScore", "DESC"], ["scheduledDate", "ASC"]],
    });

    res.json(visits);
  } catch (error) {
    console.error("Get Visits By Property Error:", error);
    res.status(500).json({ error: "Error al obtener visitas" });
  }
};

// 📌 UPDATE VISIT STATUS — Admin confirma/completa visita
export const updateVisitStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pendiente", "confirmada", "completada", "cancelada"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Estado inválido" });
      return;
    }

    const visit = await Visit.findByPk(id);
    if (!visit) {
      res.status(404).json({ error: "Visita no encontrada" });
      return;
    }

    await visit.update({ status });
    res.json({ message: "Estado de visita actualizado", visit });
  } catch (error) {
    console.error("Update Visit Status Error:", error);
    res.status(500).json({ error: "Error al actualizar visita" });
  }
};

// 📌 GET ALL VISITS — Admin ve todas las visitas
export const getAllVisits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const where: any = {};
    if (status) where.status = status;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Visit.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phoneNumber"],
        },
        {
          model: Property,
          attributes: ["id", "title", "address", "city", "price"],
        },
      ],
      limit: Number(limit),
      offset,
      order: [["priorityScore", "DESC"], ["scheduledDate", "ASC"]],
    });

    res.json({
      visits: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get All Visits Error:", error);
    res.status(500).json({ error: "Error al obtener visitas" });
  }
};
