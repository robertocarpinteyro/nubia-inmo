import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { User } from "./User";
import { PropertyMedia } from "./PropertyMedia";
import { VendorProperty } from "./VendorProperty";
import { Favorite } from "./Favorite";
import { Review } from "./Review";
import { Visit } from "./Visit";

@Table({ tableName: "properties" })
export class Property extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  titleEn?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descriptionEn?: string;

  @Column({
    type: DataType.ENUM("casa", "departamento", "terreno", "oficina", "local"),
    allowNull: false,
  })
  propertyType!: string;

  @Column({
    type: DataType.ENUM("venta", "renta"),
    allowNull: false,
  })
  transactionType!: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
  })
  discountPrice?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "MXN",
  })
  currency!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  state?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  zipCode?: string;

  @Column({
    type: DataType.DECIMAL(10, 8),
    allowNull: true,
  })
  latitude?: number;

  @Column({
    type: DataType.DECIMAL(11, 8),
    allowNull: true,
  })
  longitude?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  bedrooms?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bathrooms?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parkingSpaces?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  totalArea?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  builtArea?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  yearBuilt?: number;

  @Column({
    type: DataType.ENUM("disponible", "vendida", "rentada", "en_proceso"),
    allowNull: false,
    defaultValue: "disponible",
  })
  status!: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 4.00,
  })
  commissionPercentage?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  featured!: boolean;

  // 📌 Nuevos campos para vendedores
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  landingPageUrl?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  videoUrls?: string; // JSON array stringified

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  videoUrl?: string; // URL única del video de la propiedad (YouTube, Vimeo o MP4 directo)

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  googleMapsUrl?: string; // URL de embed de Google Maps

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mediaFolderUrl?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  technicalSheet?: string; // JSON stringified

  // Foreign key — admin who created it
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;

  @BelongsTo(() => User, "createdBy")
  creator?: User;

  // Relationships
  @HasMany(() => PropertyMedia)
  media?: PropertyMedia[];

  @HasMany(() => VendorProperty)
  vendorAssignments?: VendorProperty[];

  @HasMany(() => Favorite)
  favorites?: Favorite[];

  @HasMany(() => Review)
  reviews?: Review[];

  @HasMany(() => Visit)
  visits?: Visit[];
}
