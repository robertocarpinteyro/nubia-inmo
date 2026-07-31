import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const ROLES = ["admin", "vendedor", "usuario"]

/**
 * PATCH /api/admin/users/[id]  body: { isActive?: boolean, role?: "admin"|"vendedor"|"usuario" }
 * Cambia estado y/o rol. Solo admin. No permite modificarte a ti mismo (evita
 * bloquearte). Cambiar el rol también actualiza el metadata de Auth.
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

  if (id === session.appUserId) {
    return NextResponse.json({ error: "No puedes cambiar tu propio rol o estado" }, { status: 400 })
  }

  const admin = createAdminSupabase()
  const { data: target } = await (admin.from("users" as any) as any)
    .select("role, auth_id")
    .eq("id", id)
    .maybeSingle()

  if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (typeof body?.isActive === "boolean") patch.isActive = body.isActive
  if (body?.role !== undefined) {
    if (!ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }
    patch.role = body.role
  }

  const { error } = await (admin.from("users" as any) as any).update(patch).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
