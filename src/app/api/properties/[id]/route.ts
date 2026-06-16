import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase, createAdminSupabase, getSessionUser } from "@/lib/supabase/server"
import { formToDbColumns, dbRowToForm, rowToPublic } from "@/lib/properties/mapping"

export const dynamic = "force-dynamic"

const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(s)
const idColumn = (id: string) => (isUuid(id) ? "id" : "property_id")

/** GET /api/properties/[id] — detalle (forma de formulario para edición). */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const user = await getSessionUser()

  let q = supabase.from("properties").select("*").eq(idColumn(params.id), params.id)
  // Visitantes sin sesión: solo publicadas (la RLS también lo fuerza).
  if (!user) q = q.eq("published", true)

  const { data, error } = await q.maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  return NextResponse.json({ ...dbRowToForm(data), id: data.id, property_id: data.property_id })
}

/** PATCH /api/properties/[id] — edita. Requiere sesión. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const columns = formToDbColumns(body, true)
  const admin = createAdminSupabase()
  const { data, error } = await admin
    .from("properties")
    .update(columns as any)
    .eq(idColumn(params.id), params.id)
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ property: rowToPublic(data) })
}

/** DELETE /api/properties/[id] — borra. Requiere sesión. */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const admin = createAdminSupabase()
  const { error } = await admin
    .from("properties")
    .delete()
    .eq(idColumn(params.id), params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
