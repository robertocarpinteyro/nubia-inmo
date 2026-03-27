import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { Property } from "./Property";

@Table({ tableName: "vendor_properties" })
export class VendorProperty extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  propertyId!: number;

  @Column({
    type: DataType.ENUM("activa", "pausada", "completada"),
    allowNull: false,
    defaultValue: "activa",
  })
  status!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  assignedAt!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  // 📌 Nuevos campos para sistema de comisiones y exclusividad
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isExclusive!: boolean;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 4.00,
  })
  vendorCommission!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  propertiesSold!: number;

  @BelongsTo(() => User)
  vendor?: User;

  @BelongsTo(() => Property)
  property?: Property;
}
