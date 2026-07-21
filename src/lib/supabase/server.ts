import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { getSupabaseUrl, getSupabaseAnonKey } from "./env"

/**
 * Cliente de Supabase ligado a la sesión (cookies) para Route Handlers y
 * Server Components. Respeta RLS: lee con los permisos del usuario logueado
 * (o anon si no hay sesión).
 */
export function createServerSupabase() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
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
    getSupabaseUrl(),
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

export type AppRole = "admin" | "vendedor" | "usuario"

/**
 * Devuelve el rol del usuario autenticado leyéndolo de public.users (fuente de
 * verdad), NUNCA de user_metadata (que el propio usuario puede editar).
 * Usa service_role para saltar RLS tras validar la sesión. null si no hay sesión.
 */
export interface SessionInfo {
  /** UUID de auth.users (sesión de Supabase). */
  userId: string
  /** id entero de public.users (para FKs como properties.createdBy). */
  appUserId: number | null
  role: AppRole
}

export async function getSessionRole(): Promise<SessionInfo | null> {
  const user = await getSessionUser()
  if (!user) return null

  const admin = createAdminSupabase()
  const { data } = await admin
    // El tipo Database aún describe otro esquema; consulta sin tipar.
    .from("users" as any)
    .select("id, role")
    .eq("auth_id", user.id)
    .maybeSingle()

  const role = ((data as any)?.role ?? "usuario") as AppRole
  const appUserId = (data as any)?.id ?? null
  return { userId: user.id, appUserId, role }
}

/**
 * Exige que el usuario autenticado sea staff (admin o vendedor).
 * Devuelve la info de sesión si autoriza, o null si debe rechazarse (401/403).
 */
export async function requireStaff(): Promise<SessionInfo | null> {
  const session = await getSessionRole()
  if (!session) return null
  if (session.role !== "admin" && session.role !== "vendedor") return null
  return session
}
