import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, getSessionRole } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** GET /api/me — perfil del usuario autenticado. */
export async function GET() {
  const session = await getSessionRole()
  if (!session?.appUserId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("users" as any) as any)
    .select("id, name, email, phoneNumber, about, role, avatarUrl")
    .eq("id", session.appUserId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? {})
}

/** PATCH /api/me — actualiza el perfil propio (nombre, teléfono, acerca de). */
export async function PATCH(req: NextRequest) {
  const session = await getSessionRole()
  if (!session?.appUserId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (typeof body?.name === "string") patch.name = body.name.trim()
  if (typeof body?.phoneNumber === "string") patch.phoneNumber = body.phoneNumber.trim() || null
  if (typeof body?.about === "string") patch.about = body.about.trim() || null

  const admin = createAdminSupabase()
  const { error } = await (admin.from("users" as any) as any)
    .update(patch)
    .eq("id", session.appUserId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
