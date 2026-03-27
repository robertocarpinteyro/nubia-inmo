import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Favorite } from "../models/Favorite";
import { Property } from "../models/Property";
import { PropertyMedia } from "../models/PropertyMedia";

// 📌 ADD FAVORITE — Usuario agrega propiedad a favoritos
export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const userId = req.user!.id;

    // Verificar que la propiedad existe
    const property = await Property.findByPk(propertyId);
    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    // Verificar que no sea duplicado
    const existing = await Favorite.findOne({
      where: { userId, propertyId },
    });

    if (existing) {
      res.status(400).json({ error: "La propiedad ya está en tus favoritos" });
      return;
    }

    const favorite = await Favorite.create({
      userId,
      propertyId: Number(propertyId),
    });

    res.status(201).json({ message: "Propiedad agregada a favoritos", favorite });
  } catch (error) {
    console.error("Add Favorite Error:", error);
    res.status(500).json({ error: "Error al agregar favorito" });
  }
};

// 📌 REMOVE FAVORITE — Usuario elimina propiedad de favoritos
export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const userId = req.user!.id;

    const favorite = await Favorite.findOne({
      where: { userId, propertyId },
    });

    if (!favorite) {
      res.status(404).json({ error: "Favorito no encontrado" });
      return;
    }

    await favorite.destroy();
    res.json({ message: "Propiedad removida de favoritos" });
  } catch (error) {
    console.error("Remove Favorite Error:", error);
    res.status(500).json({ error: "Error al remover favorito" });
  }
};

// 📌 GET MY FAVORITES — Usuario ve sus favoritos
export const getMyFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Property,
          include: [
            { model: PropertyMedia, as: "media" },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(favorites);
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
};
