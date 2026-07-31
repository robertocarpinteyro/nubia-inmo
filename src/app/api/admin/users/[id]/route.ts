import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/**
 * PATCH /api/admin/users/[id]  body: { isActive: boolean }
 * Activa/desactiva un usuario o vendedor. Solo admin. No permite tocar admins.
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const id = parseInt(params.id, 10)
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Id inválido" }, { status: 400 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const isActive = !!body?.isActive

  const admin = createAdminSupabase()
  const { data: target } = await (admin.from("users" as any) as any)
    .select("role")
    .eq("id", id)
    .maybeSingle()

  if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  if ((target as any).role === "admin") {
    return NextResponse.json({ error: "No puedes modificar a un administrador" }, { status: 403 })
  }

  const { error } = await (admin.from("users" as any) as any)
    .update({ isActive, updatedAt: new Date().toISOString() })
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
