"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"

interface Favorite { id: number; property?: { title: string; price: number } }
interface Visit {
   id: number
   scheduledDate: string
   status: string
   property?: { title: string }
}
interface Review {
   id: number
   rating: number
   comment: string
   isVisible: boolean
   property?: { title: string }
}

const UserDashboard = () => {
   const { getAuthHeaders } = useAuth()
   const [favs, setFavs] = useState<Favorite[]>([])
   const [visits, setVisits] = useState<Visit[]>([])
   const [reviews, setReviews] = useState<Review[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const h = { "Content-Type": "application/json", ...getAuthHeaders() }

      Promise.all([
         fetch(`${API_BASE_URL}/favorites`, { headers: h }).then((r) => r.json()).catch(() => []),
         fetch(`${API_BASE_URL}/visits/me`, { headers: h }).then((r) => r.json()).catch(() => []),
         fetch(`${API_BASE_URL}/reviews/me`, { headers: h }).then((r) => r.json()).catch(() => []),
      ]).then(([f, v, r]) => {
         setFavs(Array.isArray(f) ? f : Array.isArray(f?.data) ? f.data : [])
         setVisits(Array.isArray(v) ? v : [])
         setReviews(Array.isArray(r) ? r : [])
      }).finally(() => setLoading(false))
   }, [getAuthHeaders])

   if (loading) return <div className="nubia-loading"><div className="spinner"></div></div>

   return (
      <>
         {/* KPIs */}
         <div className="nubia-kpi-grid">
            <div className="nubia-kpi-card purple">
               <div className="kpi-icon"><i className="bi bi-heart"></i></div>
               <div className="kpi-label">Favoritos</div>
               <div className="kpi-value">{favs.length}</div>
               <div className="kpi-sub">Propiedades guardadas</div>
            </div>
            <div className="nubia-kpi-card amber">
               <div className="kpi-icon"><i className="bi bi-calendar-check"></i></div>
               <div className="kpi-label">Visitas</div>
               <div className="kpi-value">{visits.length}</div>
               <div className="kpi-sub">Agendadas</div>
            </div>
            <div className="nubia-kpi-card green">
               <div className="kpi-icon"><i className="bi bi-star"></i></div>
               <div className="kpi-label">Reseñas</div>
               <div className="kpi-value">{reviews.length}</div>
               <div className="kpi-sub">Publicadas</div>
            </div>
            <div className="nubia-kpi-card blue">
               <div className="kpi-icon"><i className="bi bi-search"></i></div>
               <div className="kpi-label">Explorar</div>
               <div className="kpi-value" style={{ fontSize: 18, paddingTop: 8 }}>Ver catálogo</div>
               <Link href="/listing_07" className="btn-nubia-sm primary mt-2" style={{ fontSize: 12 }}>
                  Ver propiedades
               </Link>
            </div>
         </div>

         <div className="row g-3">
            {/* Favoritos */}
            <div className="col-lg-4">
               <div className="nubia-dash-card">
                  <div className="card-head">
                     <h5 className="card-title">Mis Favoritos</h5>
                     <Link href="/dashboard/favourites" className="card-action">Ver todos</Link>
                  </div>
                  {favs.length === 0 ? (
                     <div className="nubia-empty-state">
                        <i className="bi bi-heart"></i>
                        <p>Sin favoritos aún. <Link href="/listing_07" style={{ color: "#7B4FFF" }}>Explorar</Link></p>
                     </div>
                  ) : (
                     <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {favs.slice(0, 5).map((f) => (
                           <li key={f.id} style={{ padding: "12px 24px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#0C0C0C" }}>
                                 {f.property?.title ?? "Propiedad"}
                              </div>
                              {f.property?.price && (
                                 <div style={{ fontSize: 13, color: "rgba(0,0,0,0.4)" }}>
                                    ${Number(f.property.price).toLocaleString("es-MX")}
                                 </div>
                              )}
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            </div>

            {/* Visitas */}
            <div className="col-lg-4">
               <div className="nubia-dash-card">
                  <div className="card-head">
                     <h5 className="card-title">Mis Visitas</h5>
                     <Link href="/dashboard/visits" className="card-action">Ver todas</Link>
                  </div>
                  {visits.length === 0 ? (
                     <div className="nubia-empty-state">
                        <i className="bi bi-calendar-check"></i>
                        <p>No tienes visitas agendadas</p>
                     </div>
                  ) : (
                     <table className="nubia-table">
                        <thead>
                           <tr><th>Propiedad</th><th>Fecha</th><th>Estado</th></tr>
                        </thead>
                        <tbody>
                           {visits.slice(0, 5).map((v) => (
                              <tr key={v.id}>
                                 <td className="cell-bold">{v.property?.title ?? "—"}</td>
                                 <td className="cell-muted">
                                    {new Date(v.scheduledDate).toLocaleDateString("es-MX")}
                                 </td>
                                 <td>
                                    <span className={`nubia-badge ${v.status === "confirmed" ? "green" : v.status === "pending" ? "amber" : "gray"}`}>
                                       {v.status}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </div>

            {/* Reseñas */}
            <div className="col-lg-4">
               <div className="nubia-dash-card">
                  <div className="card-head">
                     <h5 className="card-title">Mis Reseñas</h5>
                     <Link href="/dashboard/review" className="card-action">Ver todas</Link>
                  </div>
                  {reviews.length === 0 ? (
                     <div className="nubia-empty-state">
                        <i className="bi bi-star"></i>
                        <p>No has escrito reseñas aún</p>
                     </div>
                  ) : (
                     <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {reviews.slice(0, 4).map((r) => (
                           <li key={r.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                 <span style={{ fontSize: 14, fontWeight: 600, color: "#0C0C0C" }}>
                                    {r.property?.title ?? "Propiedad"}
                                 </span>
                                 <span style={{ color: "#f59e0b", fontSize: 13 }}>
                                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                 </span>
                              </div>
                              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", margin: 0, lineHeight: 1.5 }}>
                                 {r.comment?.slice(0, 80)}{r.comment?.length > 80 ? "…" : ""}
                              </p>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            </div>
         </div>
      </>
   )
}

export default UserDashboard
