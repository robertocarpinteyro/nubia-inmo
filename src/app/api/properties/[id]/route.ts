import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase, createAdminSupabase, getSessionUser, requireStaff } from "@/lib/supabase/server"
import { formToDbColumns, dbRowToForm, rowToPublic } from "@/lib/properties/mapping"

export const dynamic = "force-dynamic"

const parseId = (id: string) => {
  const n = parseInt(id, 10)
  return Number.isFinite(n) ? n : null
}

/** GET /api/properties/[id] — detalle en forma de formulario (para edición). */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseId(params.id)
  if (id === null) return NextResponse.json({ error: "Id inválido" }, { status: 400 })

  const supabase = createServerSupabase()
  const user = await getSessionUser()

  let q = (supabase.from("properties" as any) as any).select("*").eq("id", id)
  // Visitantes sin sesión: solo publicadas (la RLS también lo fuerza).
  if (!user) q = q.eq("published", true)

  const { data, error } = await q.maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  return NextResponse.json({ ...dbRowToForm(data), id: data.id })
}

/** PATCH /api/properties/[id] — edita. Requiere rol staff. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const id = parseId(params.id)
  if (id === null) return NextResponse.json({ error: "Id inválido" }, { status: 400 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const columns = formToDbColumns(body, true)
  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("properties" as any) as any)
    .update(columns)
    .eq("id", id)
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ property: rowToPublic(data) })
}

/** DELETE /api/properties/[id] — borra. Requiere rol staff. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const id = parseId(params.id)
  if (id === null) return NextResponse.json({ error: "Id inválido" }, { status: 400 })

  const admin = createAdminSupabase()
  const { error } = await (admin.from("properties" as any) as any).delete().eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
