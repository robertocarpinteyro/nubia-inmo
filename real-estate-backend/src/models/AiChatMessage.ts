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

@Table({ tableName: "ai_chat_messages" })
export class AiChatMessage extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  propertyId?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response?: string;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Property)
  property?: Property;
}
