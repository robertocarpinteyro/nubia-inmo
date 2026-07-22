// Lee la configuración pública de Supabase con tolerancia de nombres y un
// fallback seguro para que el BUILD (prerender) nunca truene si las variables
// aún no están configuradas en el entorno (p. ej. en Vercel antes de añadirlas).
//
// En runtime, con las variables reales (inline de NEXT_PUBLIC_*), se usan esas.
// Si faltan, se usa un placeholder válido: el cliente se construye sin lanzar
// error, aunque las llamadas de red no funcionarán hasta configurar el entorno.

const PLACEHOLDER_URL = "https://placeholder.supabase.co"
const PLACEHOLDER_KEY = "public-anon-key-placeholder"

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    PLACEHOLDER_KEY
  )
}

/** True cuando hay configuración real (no placeholder). */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    )
  )
}
