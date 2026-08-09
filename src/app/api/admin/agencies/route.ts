import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireStaff, requireAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** GET /api/admin/agencies — lista de inmobiliarias colaboradoras. Staff. */
export async function GET() {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("partner_agencies" as any) as any)
    .select('id, name, "contactName", phone, email, notes, "createdAt"')
    .order("name", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Conteo de propiedades por inmobiliaria (colaboraciones activas).
  const result = await Promise.all(
    (data ?? []).map(async (a: any) => {
      const { count } = await (admin.from("properties" as any) as any)
        .select("id", { count: "exact", head: true })
        .eq("partnerAgencyId", a.id)
      return { ...a, propertiesCount: count ?? 0 }
    })
  )

  return NextResponse.json(result)
}

/** POST /api/admin/agencies — crea una inmobiliaria. Solo admin. */
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const name = String(body?.name || "").trim()
  if (!name) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })

  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("partner_agencies" as any) as any)
    .insert({
      name,
      contactName: body?.contactName?.trim() || null,
      phone: body?.phone?.trim() || null,
      email: body?.email?.trim() || null,
      notes: body?.notes?.trim() || null,
    })
    .select("id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 })
}
