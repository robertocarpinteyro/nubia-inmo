import { NextResponse } from "next/server"
import { createAdminSupabase, getSessionRole } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** GET /api/visits/me — visitas agendadas por el usuario. */
export async function GET() {
  const session = await getSessionRole()
  if (!session?.appUserId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const admin = createAdminSupabase()
  const { data, error } = await (admin.from("visits" as any) as any)
    .select("id, scheduledDate, scheduledTime, status, notes, property:properties ( id, title )")
    .eq("userId", session.appUserId)
    .order("scheduledDate", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
