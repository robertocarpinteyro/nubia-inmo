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

@Table({ tableName: "sales" })
export class Sale extends Model {
  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  propertyId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  buyerUserId?: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vendorId!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  salePrice!: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 4.00,
  })
  commissionPercentage!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  commissionAmount!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  saleDate!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @BelongsTo(() => Property)
  property?: Property;

  @BelongsTo(() => User, "vendorId")
  vendor?: User;
}
