require("dotenv").config();
const { Sequelize } = require("sequelize");

const seq = new Sequelize(
   process.env.SUPABASE_DB_NAME,
   process.env.SUPABASE_DB_USER,
   process.env.SUPABASE_DB_PASSWORD,
   {
      host: process.env.SUPABASE_DB_HOST,
      port: Number(process.env.SUPABASE_DB_PORT) || 6543,
      dialect: "postgres",
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false,
   }
);

async function migrate() {
   try {
      console.log("Adding 'lote' to properties.propertyType enum...");
      await seq.query(`ALTER TYPE "enum_properties_propertyType" ADD VALUE IF NOT EXISTS 'lote';`);

      console.log("Adding 'render' to property_media.mediaType enum...");
      await seq.query(`ALTER TYPE "enum_property_media_mediaType" ADD VALUE IF NOT EXISTS 'render';`);

      console.log("✅ Migration complete.");
      process.exit(0);
   } catch (e) {
      console.error("❌ Migration failed:", e.message);
      process.exit(1);
   }
}

migrate();
