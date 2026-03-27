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

@Table({
  tableName: "favorites",
  indexes: [
    {
      unique: true,
      fields: ["userId", "propertyId"],
    },
  ],
})
export class Favorite extends Model {
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

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Property)
  property?: Property;
}
