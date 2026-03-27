import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Review } from "../models/Review";
import { Property } from "../models/Property";
import { User } from "../models/User";

// 📌 CREATE — Usuario crea reseña
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating) {
      res.status(400).json({ error: "propertyId y rating son obligatorios" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating debe ser entre 1 y 5" });
      return;
    }

    // Verificar propiedad
    const property = await Property.findByPk(propertyId);
    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    // Verificar duplicado
    const existing = await Review.findOne({
      where: { userId, propertyId },
    });
    if (existing) {
      res.status(400).json({ error: "Ya has dejado una reseña para esta propiedad" });
      return;
    }

    const review = await Review.create({
      userId,
      propertyId,
      rating,
      comment,
    });

    res.status(201).json({ message: "Reseña creada exitosamente", review });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ error: "Error al crear reseña" });
  }
};

// 📌 GET PROPERTY REVIEWS — Público
export const getPropertyReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.findAll({
      where: { propertyId, isVisible: true },
      include: [
        {
          model: User,
          attributes: ["id", "name", "firstName", "lastName", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Get Property Reviews Error:", error);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
};

// 📌 GET MY REVIEWS — Usuario ve sus reseñas
export const getMyReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: Property,
          attributes: ["id", "title", "city", "state"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Get My Reviews Error:", error);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
};

// 📌 DELETE REVIEW — Admin o el propio usuario
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const review = await Review.findByPk(id);
    if (!review) {
      res.status(404).json({ error: "Reseña no encontrada" });
      return;
    }

    // Solo admin o el autor pueden eliminar
    if (userRole !== "admin" && review.userId !== userId) {
      res.status(403).json({ error: "No tienes permisos para eliminar esta reseña" });
      return;
    }

    await review.destroy();
    res.json({ message: "Reseña eliminada exitosamente" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ error: "Error al eliminar reseña" });
  }
};

// 📌 TOGGLE VISIBILITY — Solo admin
export const toggleReviewVisibility = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      res.status(404).json({ error: "Reseña no encontrada" });
      return;
    }

    await review.update({ isVisible: !review.isVisible });
    res.json({
      message: `Reseña ${review.isVisible ? "visible" : "oculta"} exitosamente`,
      review,
    });
  } catch (error) {
    console.error("Toggle Visibility Error:", error);
    res.status(500).json({ error: "Error al cambiar visibilidad" });
  }
};
