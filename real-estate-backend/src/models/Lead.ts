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

@Table({ tableName: "leads" })
export class Lead extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  vendorId?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.ENUM("website", "manual", "referral"),
    allowNull: false,
    defaultValue: "manual",
  })
  source!: string;

  @Column({
    type: DataType.ENUM("nuevo", "contactado", "en_proceso", "cerrado", "perdido"),
    allowNull: false,
    defaultValue: "nuevo",
  })
  status!: string;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  propertyId?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;

  @BelongsTo(() => User, "vendorId")
  vendor?: User;

  @BelongsTo(() => Property)
  property?: Property;
}
