import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Property } from "../models/Property";
import { PropertyMedia } from "../models/PropertyMedia";
import { User } from "../models/User";
import { Op } from "sequelize";

// 📌 CREATE — Solo admin
export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const propertyData = {
      ...req.body,
      createdBy: req.user!.id,
    };

    const property = await Property.create(propertyData);
    res.status(201).json({ message: "Propiedad creada exitosamente", property });
  } catch (error) {
    console.error("Create Property Error:", error);
    res.status(500).json({ error: "Error al crear propiedad", details: error });
  }
};

// 📌 UPDATE — Solo admin
export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    await property.update(req.body);
    res.json({ message: "Propiedad actualizada exitosamente", property });
  } catch (error) {
    console.error("Update Property Error:", error);
    res.status(500).json({ error: "Error al actualizar propiedad" });
  }
};

// 📌 DELETE — Solo admin
export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    // Eliminar media asociada
    await PropertyMedia.destroy({ where: { propertyId: id } });
    await property.destroy();

    res.json({ message: "Propiedad eliminada exitosamente" });
  } catch (error) {
    console.error("Delete Property Error:", error);
    res.status(500).json({ error: "Error al eliminar propiedad" });
  }
};

// 📌 GET ALL — Público con filtros y paginación
export const getAllProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      propertyType,
      transactionType,
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      status,
      featured,
      search,
    } = req.query;

    const where: any = {};

    if (propertyType) where.propertyType = propertyType;
    if (transactionType) where.transactionType = transactionType;
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (state) where.state = { [Op.iLike]: `%${state}%` };
    if (status) where.status = status;
    if (featured === "true") where.featured = true;
    if (bedrooms) where.bedrooms = { [Op.gte]: Number(bedrooms) };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Property.findAndCountAll({
      where,
      include: [
        { model: PropertyMedia, as: "media" },
        { model: User, as: "creator", attributes: ["id", "name"] },
      ],
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      properties: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get Properties Error:", error);
    res.status(500).json({ error: "Error al obtener propiedades" });
  }
};

// 📌 GET BY ID — Público
export const getPropertyById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: [
        { model: PropertyMedia, as: "media", order: [["sortOrder", "ASC"]] },
        { model: User, as: "creator", attributes: ["id", "name"] },
      ],
    });

    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    res.json(property);
  } catch (error) {
    console.error("Get Property Error:", error);
    res.status(500).json({ error: "Error al obtener propiedad" });
  }
};

// 📌 UPLOAD MEDIA — Solo admin
export const uploadMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { mediaType, url, title, sortOrder } = req.body;

    const property = await Property.findByPk(id);
    if (!property) {
      res.status(404).json({ error: "Propiedad no encontrada" });
      return;
    }

    const media = await PropertyMedia.create({
      propertyId: Number(id),
      mediaType,
      url,
      title,
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({ message: "Media agregada exitosamente", media });
  } catch (error) {
    console.error("Upload Media Error:", error);
    res.status(500).json({ error: "Error al agregar media" });
  }
};

// 📌 DELETE MEDIA — Solo admin
export const deleteMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, mediaId } = req.params;

    const media = await PropertyMedia.findOne({
      where: { id: mediaId, propertyId: id },
    });

    if (!media) {
      res.status(404).json({ error: "Media no encontrada" });
      return;
    }

    await media.destroy();
    res.json({ message: "Media eliminada exitosamente" });
  } catch (error) {
    console.error("Delete Media Error:", error);
    res.status(500).json({ error: "Error al eliminar media" });
  }
};
