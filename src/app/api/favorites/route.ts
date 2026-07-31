import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, getSessionRole } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** GET /api/favorites — favoritos del usuario con datos de la propiedad. */
export async function GET() {
  const session = await getSessionRole()
  if (!session?.appUserId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("favorites" as any) as any)
    .select(
      "id, propertyId, property:properties ( id, title, price, address, bedrooms, bathrooms, totalArea, status, images )"
    )
    .eq("userId", session.appUserId)
    .order("createdAt", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

/** POST /api/favorites { propertyId } — agrega (sin duplicar). */
export async function POST(req: NextRequest) {
  const session = await getSessionRole()
  if (!session?.appUserId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const propertyId = parseInt(body?.propertyId, 10)
  if (!Number.isFinite(propertyId)) {
    return NextResponse.json({ error: "propertyId inválido" }, { status: 400 })
  }

  const admin = createAdminSupabase()
  const { data: existing } = await (admin.from("favorites" as any) as any)
    .select("id")
    .eq("userId", session.appUserId)
    .eq("propertyId", propertyId)
    .maybeSingle()

  if (existing) return NextResponse.json({ ok: true, alreadyExists: true })

  const now = new Date().toISOString()
  const { error } = await (admin.from("favorites" as any) as any).insert({
    userId: session.appUserId,
    propertyId,
    createdAt: now,
    updatedAt: now,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
