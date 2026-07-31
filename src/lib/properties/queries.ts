import { createServerSupabase } from "@/lib/supabase/server"
import { rowToPublic, type PublicProperty, PTYPE_FORM_TO_DB, STATUS_FORM_TO_DB } from "./mapping"

export interface CatalogFilters {
  type?: string
  operation?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  status?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}

/**
 * Lecturas del catálogo público (Base A). Usa el cliente ligado a cookies
 * (anon si no hay sesión) — la policy `properties_public_read` restringe a
 * published = true para visitantes anónimos.
 */
export async function getPublicProperties(
  filters: CatalogFilters = {}
): Promise<{ data: PublicProperty[]; count: number }> {
  const supabase = createServerSupabase()
  // `as any`: el tipo Database generado aún describe otro proyecto.
  let query = (supabase.from("properties" as any) as any)
    .select("*", { count: "exact" })
    .eq("published", true)

  if (filters.type) query = query.eq("propertyType", PTYPE_FORM_TO_DB[filters.type] ?? filters.type)
  if (filters.operation) {
    query = query.eq("transactionType", filters.operation === "renta" ? "renta" : "venta")
  }
  if (filters.city) query = query.eq("city", filters.city)
  if (filters.status) query = query.eq("status", STATUS_FORM_TO_DB[filters.status] ?? filters.status)
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice)
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice)
  if (filters.minBedrooms != null) query = query.gte("bedrooms", filters.minBedrooms)
  if (filters.featured) query = query.eq("featured", true)
  if (filters.search) {
    query = query.textSearch("search_vector", filters.search, { type: "websearch", config: "spanish" })
  }

  query = query.order("createdAt", { ascending: false })
  if (filters.limit != null) {
    const from = filters.offset ?? 0
    query = query.range(from, from + filters.limit - 1)
  }

  const { data, error, count } = await query
  if (error) {
    console.error("getPublicProperties error:", error.message)
    return { data: [], count: 0 }
  }
  return { data: (data ?? []).map(rowToPublic), count: count ?? 0 }
}

/** Una propiedad publicada por su id (entero). */
export async function getPublicProperty(idOrSlug: string): Promise<PublicProperty | null> {
  const id = parseInt(idOrSlug, 10)
  if (!Number.isFinite(id)) return null

  const supabase = createServerSupabase()
  const { data, error } = await (supabase.from("properties" as any) as any)
    .select("*")
    .eq("published", true)
    .eq("id", id)
    .maybeSingle()
  if (error || !data) return null
  return rowToPublic(data)
}
