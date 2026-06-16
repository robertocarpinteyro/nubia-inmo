import { createServerSupabase } from "@/lib/supabase/server"
import { rowToPublic, type PublicProperty, TYPE_ES_TO_DB, OPERATION_ES_TO_DB } from "./mapping"

export interface CatalogFilters {
  type?: string // es o db
  operation?: string // es o db
  city?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}

/**
 * Lecturas del catálogo público. Usa el cliente ligado a cookies (anon si no
 * hay sesión) — la policy `public_read_published` restringe a published = true.
 */
export async function getPublicProperties(
  filters: CatalogFilters = {}
): Promise<{ data: PublicProperty[]; count: number }> {
  const supabase = createServerSupabase()
  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("published", true)

  if (filters.type) {
    query = query.eq("type", TYPE_ES_TO_DB[filters.type] ?? filters.type)
  }
  if (filters.operation) {
    query = query.eq("operation_type", OPERATION_ES_TO_DB[filters.operation] ?? filters.operation)
  }
  if (filters.city) query = query.eq("location_city", filters.city)
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice)
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice)
  if (filters.minBedrooms != null) query = query.gte("bedrooms", filters.minBedrooms)
  if (filters.featured) query = query.eq("featured", true)
  if (filters.search) {
    query = query.textSearch("search_vector", filters.search, {
      type: "websearch",
      config: "spanish",
    })
  }

  query = query.order("created_at", { ascending: false })
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

/** Una propiedad publicada por su property_id (slug) o uuid. */
export async function getPublicProperty(idOrSlug: string): Promise<PublicProperty | null> {
  const supabase = createServerSupabase()
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(idOrSlug)
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("published", true)
    .eq(isUuid ? "id" : "property_id", idOrSlug)
    .maybeSingle()
  if (error || !data) return null
  return rowToPublic(data)
}
