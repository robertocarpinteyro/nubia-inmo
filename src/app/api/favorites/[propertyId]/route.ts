import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, getSessionRole } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** DELETE /api/favorites/[propertyId] — quita el favorito del usuario. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const session = await getSessionRole()
  if (!session?.appUserId) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const propertyId = parseInt(params.propertyId, 10)
  if (!Number.isFinite(propertyId)) {
    return NextResponse.json({ error: "propertyId inválido" }, { status: 400 })
  }

  const admin = createAdminSupabase()
  const { error } = await (admin.from("favorites" as any) as any)
    .delete()
    .eq("userId", session.appUserId)
    .eq("propertyId", propertyId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
