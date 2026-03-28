"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"

interface Property {
   id: number
   title: string
   price: number
   status: string
   vendorCommission?: number
   isExclusive?: boolean
   images?: string[]
}

interface Lead {
   id: number
   name: string
   email: string
   phone?: string
   source: string
   status: string
   createdAt: string
}

interface Sale {
   id: number
   price: number
   commission: number
   createdAt: string
   property?: { title: string }
}

const VendorDashboard = () => {
   const { getAuthHeaders } = useAuth()
   const [myProps, setMyProps] = useState<Property[]>([])
   const [leads, setLeads] = useState<Lead[]>([])
   const [sales, setSales] = useState<Sale[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const h = { "Content-Type": "application/json", ...getAuthHeaders() }

      Promise.all([
         fetch(`${API_BASE_URL}/vendor/properties`, { headers: h }).then((r) => r.json()).catch(() => []),
         fetch(`${API_BASE_URL}/leads/me`, { headers: h }).then((r) => r.json()).catch(() => []),
         fetch(`${API_BASE_URL}/sales/vendor`, { headers: h }).then((r) => r.json()).catch(() => []),
      ]).then(([props, lds, sls]) => {
         setMyProps(Array.isArray(props) ? props : [])
         setLeads(Array.isArray(lds) ? lds.slice(0, 5) : [])
         setSales(Array.isArray(sls) ? sls.slice(0, 5) : [])
      }).finally(() => setLoading(false))
   }, [getAuthHeaders])

   const totalCommission = sales.reduce((sum, s) => sum + Number(s.commission || 0), 0)

   if (loading) return <div className="nubia-loading"><div className="spinner"></div></div>

   return (
      <>
         {/* KPIs */}
         <div className="nubia-kpi-grid">
            <div className="nubia-kpi-card purple">
               <div className="kpi-icon"><i className="bi bi-building"></i></div>
               <div className="kpi-label">Mis Propiedades</div>
               <div className="kpi-value">{myProps.length}</div>
               <div className="kpi-sub">Asignadas</div>
            </div>
            <div className="nubia-kpi-card green">
               <div className="kpi-icon"><i className="bi bi-cash-stack"></i></div>
               <div className="kpi-label">Mis Comisiones</div>
               <div className="kpi-value">${totalCommission.toLocaleString("es-MX")}</div>
               <div className="kpi-sub">MXN totales</div>
            </div>
            <div className="nubia-kpi-card amber">
               <div className="kpi-icon"><i className="bi bi-funnel"></i></div>
               <div className="kpi-label">Leads Activos</div>
               <div className="kpi-value">{leads.length}</div>
               <div className="kpi-sub">En seguimiento</div>
            </div>
            <div className="nubia-kpi-card blue">
               <div className="kpi-icon"><i className="bi bi-trophy"></i></div>
               <div className="kpi-label">Ventas Cerradas</div>
               <div className="kpi-value">{sales.length}</div>
               <div className="kpi-sub">Histórico</div>
            </div>
         </div>

         {/* Acciones + propiedades */}
         <div className="row g-3 mb-3">
            <div className="col-lg-4">
               <div className="nubia-dash-card h-100">
                  <div className="card-head">
                     <h5 className="card-title">Acciones</h5>
                  </div>
                  <div className="card-body-inner d-flex flex-column gap-3">
                     <Link href="/dashboard/available-properties" className="btn-nubia-sm primary w-100 justify-content-center">
                        <i className="bi bi-search"></i> Explorar Propiedades
                     </Link>
                     <Link href="/dashboard/leads" className="btn-nubia-sm outline w-100 justify-content-center">
                        <i className="bi bi-funnel"></i> Ver Leads
                     </Link>
                     <Link href="/dashboard/sales" className="btn-nubia-sm ghost w-100 justify-content-center">
                        <i className="bi bi-cash-stack"></i> Mis Ventas
                     </Link>
                     <Link href="/dashboard/ai-chat" className="btn-nubia-sm ghost w-100 justify-content-center">
                        <i className="bi bi-stars"></i> Chat AI
                     </Link>
                  </div>
               </div>
            </div>

            <div className="col-lg-8">
               <div className="nubia-dash-card">
                  <div className="card-head">
                     <h5 className="card-title">Mis Propiedades</h5>
                     <Link href="/dashboard/properties-list" className="card-action">Ver todas</Link>
                  </div>
                  {myProps.length === 0 ? (
                     <div className="nubia-empty-state">
                        <i className="bi bi-building"></i>
                        <p>No tienes propiedades asignadas. <Link href="/dashboard/available-properties" style={{ color: "#7B4FFF" }}>Explora el catálogo</Link></p>
                     </div>
                  ) : (
                     <table className="nubia-table">
                        <thead>
                           <tr>
                              <th>Propiedad</th>
                              <th>Precio</th>
                              <th>Comisión</th>
                              <th>Estado</th>
                           </tr>
                        </thead>
                        <tbody>
                           {myProps.slice(0, 6).map((p) => (
                              <tr key={p.id}>
                                 <td>
                                    <div className="cell-bold">{p.title}</div>
                                    {p.isExclusive && (
                                       <span className="nubia-badge purple" style={{ marginTop: 4 }}>Exclusiva</span>
                                    )}
                                 </td>
                                 <td className="cell-bold">${Number(p.price).toLocaleString("es-MX")}</td>
                                 <td className="cell-bold" style={{ color: "#10b981" }}>
                                    {p.vendorCommission ?? 4}%
                                 </td>
                                 <td>
                                    <span className={`nubia-badge ${p.status === "available" ? "green" : p.status === "sold" ? "gray" : "amber"}`}>
                                       {p.status === "available" ? "Disponible" : p.status === "sold" ? "Vendida" : p.status}
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

         {/* Leads */}
         <div className="nubia-dash-card">
            <div className="card-head">
               <h5 className="card-title">Leads Recientes</h5>
               <Link href="/dashboard/leads" className="card-action">Ver todos</Link>
            </div>
            {leads.length === 0 ? (
               <div className="nubia-empty-state">
                  <i className="bi bi-funnel"></i>
                  <p>No hay leads registrados aún</p>
               </div>
            ) : (
               <table className="nubia-table">
                  <thead>
                     <tr>
                        <th>Contacto</th>
                        <th>Fuente</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                     </tr>
                  </thead>
                  <tbody>
                     {leads.map((l) => (
                        <tr key={l.id}>
                           <td>
                              <div className="cell-bold">{l.name}</div>
                              <div className="cell-muted">{l.email}</div>
                           </td>
                           <td>
                              <span className="nubia-badge gray">{l.source}</span>
                           </td>
                           <td>
                              <span className={`nubia-badge ${l.status === "new" ? "blue" : l.status === "contacted" ? "amber" : "green"}`}>
                                 {l.status}
                              </span>
                           </td>
                           <td className="cell-muted">
                              {new Date(l.createdAt).toLocaleDateString("es-MX")}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </>
   )
}

export default VendorDashboard
