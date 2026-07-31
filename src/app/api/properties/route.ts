import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase, createAdminSupabase, getSessionUser, requireStaff } from "@/lib/supabase/server"
import { formToDbColumns, rowToPublic, PTYPE_FORM_TO_DB, STATUS_FORM_TO_DB } from "@/lib/properties/mapping"

export const dynamic = "force-dynamic"

/**
 * GET /api/properties
 * Lista propiedades. Con sesión de staff devuelve todas; sin sesión, solo
 * publicadas (la RLS también lo fuerza). Soporta filtros por query string.
 */
export async function GET(req: NextRequest) {
  const supabase = createServerSupabase()
  const user = await getSessionUser()
  const sp = req.nextUrl.searchParams

  // `as any`: el tipo Database generado aún describe otro proyecto.
  let query = (supabase.from("properties" as any) as any).select("*", { count: "exact" })

  if (!user) query = query.eq("published", true)

  const type = sp.get("type")
  const operation = sp.get("operation")
  const city = sp.get("city")
  const minPrice = sp.get("minPrice")
  const maxPrice = sp.get("maxPrice")
  const minBedrooms = sp.get("minBedrooms")
  const search = sp.get("search")
  const status = sp.get("status")
  const featured = sp.get("featured")
  const limit = Number(sp.get("limit") ?? 100)
  const offset = Number(sp.get("offset") ?? 0)

  if (type) query = query.eq("propertyType", PTYPE_FORM_TO_DB[type] ?? type)
  if (operation) query = query.eq("transactionType", operation === "renta" ? "renta" : "venta")
  if (city) query = query.eq("city", city)
  if (status) query = query.eq("status", STATUS_FORM_TO_DB[status] ?? status)
  if (featured === "true") query = query.eq("featured", true)
  if (minPrice) query = query.gte("price", Number(minPrice))
  if (maxPrice) query = query.lte("price", Number(maxPrice))
  if (minBedrooms) query = query.gte("bedrooms", Number(minBedrooms))
  if (search) query = query.textSearch("search_vector", search, { type: "websearch", config: "spanish" })

  query = query.order("createdAt", { ascending: false }).range(offset, offset + limit - 1)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    properties: (data ?? []).map(rowToPublic),
    count: count ?? 0,
  })
}

/**
 * POST /api/properties
 * Crea una propiedad. Requiere rol staff (admin/vendedor). Escribe con service_role.
 */
export async function POST(req: NextRequest) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (!body?.title) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
  }
  if (session.appUserId == null) {
    return NextResponse.json({ error: "Usuario sin perfil asociado" }, { status: 400 })
  }

  const columns = { ...formToDbColumns(body, false), createdBy: session.appUserId }
  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("properties" as any) as any)
    .insert(columns)
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ property: rowToPublic(data) }, { status: 201 })
}
