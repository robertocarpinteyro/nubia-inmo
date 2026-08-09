import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** GET /api/admin/vendors — vendedores con estadísticas. Solo admin. */
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const admin = createAdminSupabase()
  const { data: vendors, error } = await (admin.from("users" as any) as any)
    .select('id, name, email, isActive, "partnerAgencyId"')
    .eq("role", "vendedor")
    .order("createdAt", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mapa id→nombre de inmobiliaria para etiquetar cada vendedor.
  const { data: agencies } = await (admin.from("partner_agencies" as any) as any).select("id, name")
  const agencyName = new Map((agencies ?? []).map((a: any) => [a.id, a.name]))

  const result = await Promise.all(
    (vendors ?? []).map(async (v: any) => {
      const { count: propertiesCount } = await (admin.from("properties" as any) as any)
        .select("id", { count: "exact", head: true })
        .eq("createdBy", v.id)
      const { count: propertiesSold } = await (admin.from("sales" as any) as any)
        .select("id", { count: "exact", head: true })
        .eq("vendorId", v.id)
      return {
        id: v.id,
        name: v.name,
        email: v.email,
        isActive: v.isActive,
        partnerAgencyId: v.partnerAgencyId ?? null,
        agencyName: v.partnerAgencyId ? agencyName.get(v.partnerAgencyId) ?? null : null,
        propertiesCount: propertiesCount ?? 0,
        propertiesSold: propertiesSold ?? 0,
      }
    })
  )

  return NextResponse.json(result)
}

/** POST /api/admin/vendors { name, email, password } — crea un vendedor. Solo admin. */
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const name = String(body?.name || "").trim()
  const email = String(body?.email || "").trim().toLowerCase()
  const password = String(body?.password || "")
  if (!name || !email || password.length < 6) {
    return NextResponse.json(
      { error: "Nombre, email y contraseña (mínimo 6 caracteres) son obligatorios" },
      { status: 400 }
    )
  }

  const admin = createAdminSupabase()
  // Crea el usuario en Supabase Auth (email confirmado → puede entrar de una vez).
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })

  if (error || !created?.user) {
    const msg = /already|registered|exists|duplicate/i.test(error?.message || "")
      ? "Ese email ya está registrado"
      : error?.message || "No se pudo crear el vendedor"
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // El trigger creó la fila en public.users como 'usuario'; promover a vendedor.
  const { error: upErr } = await (admin.from("users" as any) as any)
    .update({ role: "vendedor", name, updatedAt: new Date().toISOString() })
    .eq("auth_id", created.user.id)

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
