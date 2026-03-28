"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import { Bar } from "react-chartjs-2"
import "chart.js/auto"

interface EconomyData {
   totalProperties: number
   totalVendors: number
   totalSales: number
   totalCommissions: number
   recentSales: { id: number; price: number; commission: number; createdAt: string }[]
}

interface Vendor {
   id: number
   name: string
   email: string
   propertiesCount?: number
   totalSales?: number
}

interface User {
   id: number
   name: string
   email: string
   isActive: boolean
   hasPurchased: boolean
   createdAt: string
}

const AdminDashboard = () => {
   const { getAuthHeaders } = useAuth()
   const [economy, setEconomy] = useState<EconomyData | null>(null)
   const [vendors, setVendors] = useState<Vendor[]>([])
   const [users, setUsers] = useState<User[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const h = { "Content-Type": "application/json", ...getAuthHeaders() }

      Promise.all([
         fetch(`${API_BASE_URL}/admin/economy`, { headers: h }).then((r) => r.json()).catch(() => null),
         fetch(`${API_BASE_URL}/admin/vendors`, { headers: h }).then((r) => r.json()).catch(() => []),
         fetch(`${API_BASE_URL}/admin/users`, { headers: h }).then((r) => r.json()).catch(() => []),
      ]).then(([eco, vend, usr]) => {
         setEconomy(eco)
         setVendors(Array.isArray(vend) ? vend.slice(0, 5) : [])
         setUsers(Array.isArray(usr) ? usr.slice(0, 5) : [])
      }).finally(() => setLoading(false))
   }, [getAuthHeaders])

   const chartData = {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [{
         label: "Visitas registradas",
         backgroundColor: "#7B4FFF",
         borderRadius: 4,
         data: [12, 8, 15, 6, 20, 14, 10],
      }],
   }

   const chartOptions = {
      plugins: { legend: { display: false } },
      scales: {
         y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" } },
         x: { grid: { display: false } },
      },
   }

   if (loading) return <div className="nubia-loading"><div className="spinner"></div></div>

   return (
      <>
         {/* KPIs */}
         <div className="nubia-kpi-grid">
            <div className="nubia-kpi-card purple">
               <div className="kpi-icon"><i className="bi bi-building"></i></div>
               <div className="kpi-label">Total Propiedades</div>
               <div className="kpi-value">{economy?.totalProperties ?? "—"}</div>
               <div className="kpi-sub">En plataforma</div>
            </div>
            <div className="nubia-kpi-card green">
               <div className="kpi-icon"><i className="bi bi-cash-stack"></i></div>
               <div className="kpi-label">Ventas Registradas</div>
               <div className="kpi-value">{economy?.totalSales ?? "—"}</div>
               <div className="kpi-sub">Total histórico</div>
            </div>
            <div className="nubia-kpi-card amber">
               <div className="kpi-icon"><i className="bi bi-people"></i></div>
               <div className="kpi-label">Vendedores Activos</div>
               <div className="kpi-value">{economy?.totalVendors ?? "—"}</div>
               <div className="kpi-sub">En la red</div>
            </div>
            <div className="nubia-kpi-card blue">
               <div className="kpi-icon"><i className="bi bi-percent"></i></div>
               <div className="kpi-label">Comisiones</div>
               <div className="kpi-value">
                  {economy?.totalCommissions
                     ? `$${Number(economy.totalCommissions).toLocaleString("es-MX")}`
                     : "—"}
               </div>
               <div className="kpi-sub">MXN acumulados</div>
            </div>
         </div>

         {/* Charts + vendors */}
         <div className="row g-3 mb-3">
            <div className="col-lg-7">
               <div className="nubia-dash-card h-100">
                  <div className="card-head">
                     <h5 className="card-title">Actividad Semanal</h5>
                  </div>
                  <div className="card-body-inner">
                     <Bar data={chartData} options={chartOptions} />
                  </div>
               </div>
            </div>

            <div className="col-lg-5">
               <div className="nubia-dash-card h-100">
                  <div className="card-head">
                     <h5 className="card-title">Acciones Rápidas</h5>
                  </div>
                  <div className="card-body-inner d-flex flex-column gap-3">
                     <Link href="/dashboard/add-property" className="btn-nubia-sm primary w-100 justify-content-center">
                        <i className="bi bi-plus-circle"></i> Añadir Propiedad
                     </Link>
                     <Link href="/dashboard/vendors" className="btn-nubia-sm outline w-100 justify-content-center">
                        <i className="bi bi-person-plus"></i> Crear Vendedor
                     </Link>
                     <Link href="/dashboard/economy" className="btn-nubia-sm ghost w-100 justify-content-center">
                        <i className="bi bi-bar-chart-line"></i> Ver Economía
                     </Link>
                     <Link href="/dashboard/users" className="btn-nubia-sm ghost w-100 justify-content-center">
                        <i className="bi bi-people"></i> Gestionar Usuarios
                     </Link>
                  </div>
               </div>
            </div>
         </div>

         {/* Tables */}
         <div className="row g-3">
            <div className="col-lg-6">
               <div className="nubia-dash-card">
                  <div className="card-head">
                     <h5 className="card-title">Vendedores Recientes</h5>
                     <Link href="/dashboard/vendors" className="card-action">Ver todos</Link>
                  </div>
                  {vendors.length === 0 ? (
                     <div className="nubia-empty-state">
                        <i className="bi bi-people"></i>
                        <p>No hay vendedores registrados</p>
                     </div>
                  ) : (
                     <table className="nubia-table">
                        <thead>
                           <tr>
                              <th>Nombre</th>
                              <th>Email</th>
                              <th>Propiedades</th>
                           </tr>
                        </thead>
                        <tbody>
                           {vendors.map((v) => (
                              <tr key={v.id}>
                                 <td className="cell-bold">{v.name}</td>
                                 <td className="cell-muted">{v.email}</td>
                                 <td>
                                    <span className="nubia-badge purple">{v.propertiesCount ?? 0}</span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </div>

            <div className="col-lg-6">
               <div className="nubia-dash-card">
                  <div className="card-head">
                     <h5 className="card-title">Usuarios Recientes</h5>
                     <Link href="/dashboard/users" className="card-action">Ver todos</Link>
                  </div>
                  {users.length === 0 ? (
                     <div className="nubia-empty-state">
                        <i className="bi bi-person"></i>
                        <p>No hay usuarios registrados</p>
                     </div>
                  ) : (
                     <table className="nubia-table">
                        <thead>
                           <tr>
                              <th>Nombre</th>
                              <th>Estado</th>
                              <th>Comprador</th>
                           </tr>
                        </thead>
                        <tbody>
                           {users.map((u) => (
                              <tr key={u.id}>
                                 <td>
                                    <div className="cell-bold">{u.name}</div>
                                    <div className="cell-muted">{u.email}</div>
                                 </td>
                                 <td>
                                    <span className={`nubia-badge ${u.isActive ? "green" : "red"}`}>
                                       {u.isActive ? "Activo" : "Inactivo"}
                                    </span>
                                 </td>
                                 <td>
                                    <span className={`nubia-badge ${u.hasPurchased ? "purple" : "gray"}`}>
                                       {u.hasPurchased ? "Sí" : "No"}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </div>
         </div>
      </>
   )
}

export default AdminDashboard
