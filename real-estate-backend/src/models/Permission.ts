import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "permissions",
  indexes: [
    {
      unique: true,
      fields: ["role", "permission"],
    },
  ],
})
export class Permission extends Model {
  @Column({
    type: DataType.ENUM("admin", "vendedor", "usuario"),
    allowNull: false,
  })
  role!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  permission!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isEnabled!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;
}
