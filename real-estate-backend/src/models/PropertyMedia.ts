import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Property } from "./Property";

@Table({ tableName: "property_media" })
export class PropertyMedia extends Model {
  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  propertyId!: number;

  @Column({
    type: DataType.ENUM("image", "video", "document", "floorplan", "render"),
    allowNull: false,
  })
  mediaType!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  sortOrder?: number;

  @BelongsTo(() => Property)
  property?: Property;
}
