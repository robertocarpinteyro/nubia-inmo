import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

/**
 * Cliente de Supabase ligado a la sesión (cookies) para Route Handlers y
 * Server Components. Respeta RLS: lee con los permisos del usuario logueado
 * (o anon si no hay sesión).
 */
export function createServerSupabase() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Llamado desde un Server Component: ignorable, el middleware
            // (o el Route Handler) refresca la cookie.
          }
        },
      },
    }
  )
}

/**
 * Cliente administrador con service_role. SOLO servidor.
 * Bypassa RLS — úsalo únicamente tras validar la sesión del usuario.
 */
export function createAdminSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está configurada. Agrégala en .env.local (solo servidor)."
    )
  }
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

/**
 * Devuelve el usuario autenticado a partir de las cookies de sesión, o null.
 * Usado por los Route Handlers para autorizar escrituras.
 */
export async function getSessionUser() {
  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
