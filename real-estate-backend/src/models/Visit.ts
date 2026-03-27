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

@Table({ tableName: "visits" })
export class Visit extends Model {
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
    type: DataType.DATEONLY,
    allowNull: false,
  })
  scheduledDate!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  scheduledTime!: string;

  @Column({
    type: DataType.ENUM("pendiente", "confirmada", "completada", "cancelada"),
    allowNull: false,
    defaultValue: "pendiente",
  })
  status!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  priorityScore!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Property)
  property?: Property;
}
