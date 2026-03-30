/**
 * Migración: Full Text Search en tabla properties
 * Ejecutar una sola vez: cd real-estate-backend && npx ts-node -r reflect-metadata src/scripts/migrate-fts.ts
 */
import { sequelize } from "../config/database"
import dotenv from "dotenv"
dotenv.config()

const run = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Conectado a Supabase")

    // 1. Columna tsvector
    await sequelize.query(`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS search_vector tsvector;
    `)
    console.log("✅ Columna search_vector creada")

    // 2. Índice GIN
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS properties_search_vector_idx
      ON properties USING GIN(search_vector);
    `)
    console.log("✅ Índice GIN creado")

    // 3. Función trigger
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION update_properties_search_vector()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('spanish', COALESCE(NEW.title, '')), 'A') ||
          setweight(to_tsvector('spanish', COALESCE(NEW."titleEn", '')), 'A') ||
          setweight(to_tsvector('spanish', COALESCE(NEW.city, '')), 'B') ||
          setweight(to_tsvector('spanish', COALESCE(NEW.state, '')), 'B') ||
          setweight(to_tsvector('spanish', COALESCE(NEW.address, '')), 'C') ||
          setweight(to_tsvector('spanish', COALESCE(NEW.description, '')), 'D') ||
          setweight(to_tsvector('spanish', COALESCE(NEW."descriptionEn", '')), 'D');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)
    console.log("✅ Función trigger creada")

    // 4. Trigger
    await sequelize.query(`
      DROP TRIGGER IF EXISTS properties_search_vector_update ON properties;
      CREATE TRIGGER properties_search_vector_update
        BEFORE INSERT OR UPDATE ON properties
        FOR EACH ROW EXECUTE FUNCTION update_properties_search_vector();
    `)
    console.log("✅ Trigger creado")

    // 5. Poblar filas existentes
    const [, meta] = await sequelize.query(`
      UPDATE properties SET search_vector =
        setweight(to_tsvector('spanish', COALESCE(title, '')), 'A') ||
        setweight(to_tsvector('spanish', COALESCE("titleEn", '')), 'A') ||
        setweight(to_tsvector('spanish', COALESCE(city, '')), 'B') ||
        setweight(to_tsvector('spanish', COALESCE(state, '')), 'B') ||
        setweight(to_tsvector('spanish', COALESCE(address, '')), 'C') ||
        setweight(to_tsvector('spanish', COALESCE(description, '')), 'D') ||
        setweight(to_tsvector('spanish', COALESCE("descriptionEn", '')), 'D');
    `)
    console.log(`✅ Filas existentes indexadas`)

    console.log("\n🚀 Migración FTS completada. El buscador ya está listo.")
    process.exit(0)
  } catch (err) {
    console.error("❌ Error en migración:", err)
    process.exit(1)
  }
}

run()
