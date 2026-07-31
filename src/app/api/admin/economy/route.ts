import { NextResponse } from "next/server"
import { createAdminSupabase, requireAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** GET /api/admin/economy — KPIs económicos y ventas recientes. Solo admin. */
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const admin = createAdminSupabase()

  const [propsRes, vendorsRes, salesRes] = await Promise.all([
    (admin.from("properties" as any) as any).select("id", { count: "exact", head: true }),
    (admin.from("users" as any) as any).select("id", { count: "exact", head: true }).eq("role", "vendedor"),
    (admin.from("sales" as any) as any)
      .select("id, salePrice, commissionAmount, createdAt, property:properties(title)")
      .order("createdAt", { ascending: false }),
  ])

  const sales = (salesRes.data ?? []) as any[]
  const totalCommissions = sales.reduce((a, s) => a + Number(s.commissionAmount || 0), 0)
  const totalRevenue = sales.reduce((a, s) => a + Number(s.salePrice || 0), 0)

  const recentSales = sales.slice(0, 8).map((s) => ({
    id: s.id,
    price: Number(s.salePrice || 0),
    commission: Number(s.commissionAmount || 0),
    createdAt: s.createdAt,
    property: { title: s.property?.title ?? "—" },
  }))

  return NextResponse.json({
    totalProperties: propsRes.count ?? 0,
    totalVendors: vendorsRes.count ?? 0,
    totalSales: sales.length,
    totalCommissions,
    totalRevenue,
    recentSales,
  })
}
