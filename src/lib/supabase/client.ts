"use client"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

/**
 * Cliente de Supabase para el navegador (Client Components).
 * Usa la anon/publishable key — SOLO lecturas públicas y sesión de Auth.
 * Las escrituras privilegiadas pasan por los Route Handlers (service_role).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
