import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, getSessionRole } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** POST /api/visits { propertyId, scheduledDate, scheduledTime?, notes? }
 *  Agenda una visita. Requiere sesión (la visita queda ligada al usuario). */
export async function POST(req: NextRequest) {
  const session = await getSessionRole()
  if (!session?.appUserId) {
    return NextResponse.json({ error: "Debes iniciar sesión para agendar una visita" }, { status: 401 })
  }

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
  const scheduledDate = String(body?.scheduledDate || "").trim()
  if (!scheduledDate) {
    return NextResponse.json({ error: "La fecha es obligatoria" }, { status: 400 })
  }
  const scheduledTime = String(body?.scheduledTime || "10:00").trim()

  const now = new Date().toISOString()
  const admin = createAdminSupabase()
  const { error } = await (admin.from("visits" as any) as any).insert({
    userId: session.appUserId,
    propertyId,
    scheduledDate,
    scheduledTime,
    status: "pendiente",
    notes: body?.notes ? String(body.notes) : null,
    createdAt: now,
    updatedAt: now,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
