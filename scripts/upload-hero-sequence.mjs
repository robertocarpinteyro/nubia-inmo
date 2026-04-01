import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = "https://fafjujnwwcgijzvouwgb.supabase.co"
// Usa la SERVICE ROLE key (Settings > API > service_role)
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
   console.error("❌  Falta SUPABASE_SERVICE_ROLE_KEY en env")
   process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const IMAGES_DIR = join(__dirname, "../public/assets/images/hero/casaSequenciaImagenes")
const BUCKET = "hero-sequence"

const files = readdirSync(IMAGES_DIR).filter(f => f.endsWith(".jpg")).sort()
console.log(`📂  ${files.length} imágenes encontradas`)

let ok = 0, fail = 0
for (const file of files) {
   const path = join(IMAGES_DIR, file)
   const buffer = readFileSync(path)
   const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file, buffer, { contentType: "image/jpeg", upsert: true })
   if (error) {
      console.error(`❌  ${file}:`, error.message)
      fail++
   } else {
      process.stdout.write(`✅  ${file}\r`)
      ok++
   }
}

console.log(`\n\n✅  ${ok} subidas  ❌  ${fail} errores`)
console.log(`\nURL base: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`)
