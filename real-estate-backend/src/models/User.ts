import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Property } from "./Property";
import { VendorProperty } from "./VendorProperty";
import { Favorite } from "./Favorite";
import { Review } from "./Review";
import { Visit } from "./Visit";
import { Lead } from "./Lead";
import { Sale } from "./Sale";

@Table({ tableName: "users" })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  termsAccepted!: boolean;

  @Column({
    type: DataType.ENUM("admin", "vendedor", "usuario"),
    allowNull: false,
    defaultValue: "usuario",
  })
  role!: "admin" | "vendedor" | "usuario";

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  about?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatarUrl?: string;

  // 📌 Nuevos campos para el sistema de roles
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  hasPurchased!: boolean;

  // Relationships
  @HasMany(() => Property, "createdBy")
  createdProperties?: Property[];

  @HasMany(() => VendorProperty)
  vendorProperties?: VendorProperty[];

  @HasMany(() => Favorite)
  favorites?: Favorite[];

  @HasMany(() => Review)
  reviews?: Review[];

  @HasMany(() => Visit)
  visits?: Visit[];

  @HasMany(() => Lead, "vendorId")
  assignedLeads?: Lead[];

  @HasMany(() => Sale, "vendorId")
  sales?: Sale[];
}
