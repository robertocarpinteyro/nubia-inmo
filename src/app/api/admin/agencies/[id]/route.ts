import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** PATCH /api/admin/agencies/[id] — edita una inmobiliaria. Solo admin. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const id = Number(params.id)
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (body.name !== undefined) patch.name = String(body.name).trim()
  if (body.contactName !== undefined) patch.contactName = body.contactName?.trim() || null
  if (body.phone !== undefined) patch.phone = body.phone?.trim() || null
  if (body.email !== undefined) patch.email = body.email?.trim() || null
  if (body.notes !== undefined) patch.notes = body.notes?.trim() || null

  const admin = createAdminSupabase()
  const { error } = await (admin.from("partner_agencies" as any) as any).update(patch).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** DELETE /api/admin/agencies/[id] — elimina una inmobiliaria. Solo admin. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const id = Number(params.id)
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const admin = createAdminSupabase()
  // Las FKs quedan en SET NULL (propiedades/vendedores no se borran).
  const { error } = await (admin.from("partner_agencies" as any) as any).delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
