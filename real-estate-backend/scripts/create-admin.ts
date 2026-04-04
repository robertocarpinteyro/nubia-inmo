/**
 * Uso: npx ts-node scripts/create-admin.ts "Nombre" "email@nubia.mx" "password"
 */
import bcrypt from "bcryptjs"
import { Sequelize, DataTypes } from "sequelize"
import * as dotenv from "dotenv"
dotenv.config()

const [,, name, email, password] = process.argv

if (!name || !email || !password) {
   console.error("Uso: npx ts-node scripts/create-admin.ts \"Nombre\" \"email\" \"password\"")
   process.exit(1)
}

const seq = new Sequelize(
   process.env.SUPABASE_DB_NAME!,
   process.env.SUPABASE_DB_USER!,
   process.env.SUPABASE_DB_PASSWORD!,
   {
      host: process.env.SUPABASE_DB_HOST!,
      port: Number(process.env.SUPABASE_DB_PORT) || 6543,
      dialect: "postgres",
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false,
   }
)

const User = seq.define("User", {
   name: DataTypes.STRING,
   email: DataTypes.STRING,
   password: DataTypes.STRING,
   role: DataTypes.STRING,
   isActive: DataTypes.BOOLEAN,
   termsAccepted: DataTypes.BOOLEAN,
   hasPurchased: DataTypes.BOOLEAN,
}, { tableName: "users" })

async function main() {
   await seq.authenticate()
   const hash = await bcrypt.hash(password, 10)
   const user = await User.create({ name, email, password: hash, role: "admin", isActive: true, termsAccepted: true, hasPurchased: false })
   console.log(`✅ Admin creado: ${email} (id: ${(user as any).id})`)
   await seq.close()
}

main().catch(e => { console.error("❌", e.message); process.exit(1) })
