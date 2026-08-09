import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireStaff } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const BUCKET = "collaboration-docs"

/** GET /api/admin/collaboration-docs?propertyId=9 — docs de una propiedad, con URL firmada. Staff. */
export async function GET(req: NextRequest) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const propertyId = Number(req.nextUrl.searchParams.get("propertyId"))
  if (!Number.isFinite(propertyId))
    return NextResponse.json({ error: "propertyId inválido" }, { status: 400 })

  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("collaboration_documents" as any) as any)
    .select('id, name, url, "createdAt"')
    .eq("propertyId", propertyId)
    .order("createdAt", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // `url` guarda el path dentro del bucket privado → firmamos por 1 hora.
  const docs = await Promise.all(
    (data ?? []).map(async (d: any) => {
      const { data: signed } = await admin.storage.from(BUCKET).createSignedUrl(d.url, 3600)
      return { id: d.id, name: d.name, createdAt: d.createdAt, signedUrl: signed?.signedUrl ?? null }
    })
  )

  return NextResponse.json(docs)
}

/** POST /api/admin/collaboration-docs { propertyId, name, path } — registra un doc ya subido. Staff. */
export async function POST(req: NextRequest) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const propertyId = Number(body?.propertyId)
  const name = String(body?.name || "").trim()
  const path = String(body?.path || "").trim()
  if (!Number.isFinite(propertyId) || !name || !path)
    return NextResponse.json({ error: "propertyId, name y path son obligatorios" }, { status: 400 })

  const admin = createAdminSupabase()

  // Heredar la inmobiliaria de la propiedad, si la tiene.
  const { data: prop } = await (admin.from("properties" as any) as any)
    .select("partnerAgencyId")
    .eq("id", propertyId)
    .single()

  const { error } = await (admin.from("collaboration_documents" as any) as any).insert({
    propertyId,
    partnerAgencyId: prop?.partnerAgencyId ?? null,
    name,
    url: path,
    uploadedBy: session.appUserId,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}

/** DELETE /api/admin/collaboration-docs?id=1 — borra el registro (el archivo queda en Storage). Staff. */
export async function DELETE(req: NextRequest) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const id = Number(req.nextUrl.searchParams.get("id"))
  if (!Number.isFinite(id)) return NextResponse.json({ error: "id inválido" }, { status: 400 })

  const admin = createAdminSupabase()
  const { data: row } = await (admin.from("collaboration_documents" as any) as any)
    .select("url")
    .eq("id", id)
    .single()

  if (row?.url) await admin.storage.from(BUCKET).remove([row.url]).catch(() => {})
  const { error } = await (admin.from("collaboration_documents" as any) as any).delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
