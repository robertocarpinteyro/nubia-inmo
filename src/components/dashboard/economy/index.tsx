"use client"
import { useEffect, useState } from "react"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"
import { Bar } from "react-chartjs-2"
import "chart.js/auto"

interface EconomyData {
   totalProperties: number
   totalVendors: number
   totalSales: number
   totalCommissions: number
   totalRevenue?: number
   recentSales?: { id: number; price: number; commission: number; createdAt: string; property?: { title: string }; buyer?: { name: string } }[]
}

const EconomyPage = () => {
   const { getAuthHeaders } = useAuth()
   const [data, setData] = useState<EconomyData | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetch(`${API_BASE_URL}/admin/economy`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then(setData)
         .catch(() => null)
         .finally(() => setLoading(false))
   }, [])

   const salesData = {
      labels: data?.recentSales?.map((s) => new Date(s.createdAt).toLocaleDateString("es-MX", { month: "short", day: "numeric" })) ?? [],
      datasets: [{
         label: "Precio de Venta",
         data: data?.recentSales?.map((s) => s.price) ?? [],
         backgroundColor: "#7B4FFF",
         borderRadius: 4,
      }],
   }

   return (
      <DashboardLayout title="Economía" allowedRoles={["admin"]}>
         {loading ? (
            <div className="nubia-loading"><div className="spinner"></div></div>
         ) : (
            <>
               <div className="nubia-kpi-grid mb-4">
                  <div className="nubia-kpi-card purple">
                     <div className="kpi-icon"><i className="bi bi-building"></i></div>
                     <div className="kpi-label">Propiedades</div>
                     <div className="kpi-value">{data?.totalProperties ?? 0}</div>
                  </div>
                  <div className="nubia-kpi-card green">
                     <div className="kpi-icon"><i className="bi bi-cash-stack"></i></div>
                     <div className="kpi-label">Total Ventas</div>
                     <div className="kpi-value">{data?.totalSales ?? 0}</div>
                  </div>
                  <div className="nubia-kpi-card amber">
                     <div className="kpi-icon"><i className="bi bi-percent"></i></div>
                     <div className="kpi-label">Comisiones Totales</div>
                     <div className="kpi-value">
                        ${Number(data?.totalCommissions ?? 0).toLocaleString("es-MX")}
                     </div>
                  </div>
                  <div className="nubia-kpi-card blue">
                     <div className="kpi-icon"><i className="bi bi-people"></i></div>
                     <div className="kpi-label">Vendedores</div>
                     <div className="kpi-value">{data?.totalVendors ?? 0}</div>
                  </div>
               </div>

               <div className="row g-3">
                  <div className="col-lg-7">
                     <div className="nubia-dash-card">
                        <div className="card-head"><h5 className="card-title">Ventas Recientes</h5></div>
                        <div className="card-body-inner">
                           {(data?.recentSales?.length ?? 0) > 0
                              ? <Bar data={salesData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
                              : <div className="nubia-empty-state"><i className="bi bi-bar-chart"></i><p>Sin ventas registradas</p></div>
                           }
                        </div>
                     </div>
                  </div>

                  <div className="col-lg-5">
                     <div className="nubia-dash-card">
                        <div className="card-head"><h5 className="card-title">Últimas Ventas</h5></div>
                        {(data?.recentSales?.length ?? 0) === 0 ? (
                           <div className="nubia-empty-state"><i className="bi bi-cash-stack"></i><p>Sin ventas aún</p></div>
                        ) : (
                           <table className="nubia-table">
                              <thead><tr><th>Propiedad</th><th>Precio</th><th>Comisión</th></tr></thead>
                              <tbody>
                                 {data?.recentSales?.map((s) => (
                                    <tr key={s.id}>
                                       <td className="cell-bold">{s.property?.title ?? "—"}</td>
                                       <td>${Number(s.price).toLocaleString("es-MX")}</td>
                                       <td style={{ color: "#10b981", fontWeight: 600 }}>${Number(s.commission).toLocaleString("es-MX")}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        )}
                     </div>
                  </div>
               </div>
            </>
         )}
      </DashboardLayout>
   )
}

export default EconomyPage
