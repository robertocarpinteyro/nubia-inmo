import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import { Property } from "../models/Property";
import { PropertyMedia } from "../models/PropertyMedia";
import { VendorProperty } from "../models/VendorProperty";
import { Favorite } from "../models/Favorite";
import { Review } from "../models/Review";
import { Visit } from "../models/Visit";
import { Lead } from "../models/Lead";
import { Sale } from "../models/Sale";
import { Permission } from "../models/Permission";
import { AiChatMessage } from "../models/AiChatMessage";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.SUPABASE_DB_NAME || "postgres",
  username: process.env.SUPABASE_DB_USER || "postgres",
  password: process.env.SUPABASE_DB_PASSWORD || "",
  host: process.env.SUPABASE_DB_HOST || "127.0.0.1",
  port: parseInt(process.env.SUPABASE_DB_PORT || "5432"),
  dialect: "postgres",
  models: [
    User,
    Property,
    PropertyMedia,
    VendorProperty,
    Favorite,
    Review,
    Visit,
    Lead,
    Sale,
    Permission,
    AiChatMessage,
  ],
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});
