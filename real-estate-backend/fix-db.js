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

async function fix() {
   try {
      console.log("Adding column...");
      await seq.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS search_vector tsvector;');
      console.log("Updating properties to fire trigger...");
      await seq.query('UPDATE properties SET title = title;');
      console.log("FIXED");
      process.exit(0);
   } catch(e) {
      console.error(e);
      process.exit(1);
   }
}
fix();
