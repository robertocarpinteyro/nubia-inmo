import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/**
 * GET /api/admin/users?filter=agendaron|compraron
 * Lista de usuarios (rol "usuario"). Solo admin.
 */
export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const filter = req.nextUrl.searchParams.get("filter") || ""
  const admin = createAdminSupabase()

  let q = (admin.from("users" as any) as any)
    .select("id, name, email, isActive, hasPurchased, createdAt")
    .eq("role", "usuario")
    .order("createdAt", { ascending: false })

  if (filter === "compraron") {
    q = q.eq("hasPurchased", true)
  } else if (filter === "agendaron") {
    const { data: visitRows } = await (admin.from("visits" as any) as any).select("userId")
    const ids = Array.from(
      new Set((visitRows ?? []).map((v: any) => v.userId).filter((x: any) => x != null))
    )
    if (ids.length === 0) return NextResponse.json([])
    q = q.in("id", ids)
  }

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
