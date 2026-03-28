"use client"
import { useEffect, useState } from "react"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"

interface Visit {
   id: number
   scheduledDate: string
   status: string
   notes?: string
   property?: { id: number; title: string }
}

const VisitsPage = () => {
   const { getAuthHeaders } = useAuth()
   const [visits, setVisits] = useState<Visit[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetch(`${API_BASE_URL}/visits/me`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => setVisits(Array.isArray(d) ? d : []))
         .catch(() => setVisits([]))
         .finally(() => setLoading(false))
   }, [])

   const statusColor: Record<string, string> = { pending: "amber", confirmed: "green", cancelled: "red", completed: "purple" }
   const statusLabel: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada", completed: "Completada" }

   return (
      <DashboardLayout title="Mis Visitas" allowedRoles={["usuario"]}>
         <div className="mb-4">
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Mis Visitas Agendadas</h2>
            <p style={{ fontSize: 14, color: "rgba(0,0,0,0.4)", margin: 0 }}>{visits.length} visitas registradas</p>
         </div>

         {loading ? (
            <div className="nubia-loading"><div className="spinner"></div></div>
         ) : visits.length === 0 ? (
            <div className="nubia-dash-card">
               <div className="nubia-empty-state">
                  <i className="bi bi-calendar-x"></i>
                  <p>No tienes visitas agendadas. Explora propiedades y agenda una visita.</p>
               </div>
            </div>
         ) : (
            <div className="nubia-dash-card">
               <table className="nubia-table">
                  <thead>
                     <tr><th>Propiedad</th><th>Fecha</th><th>Estado</th><th>Notas</th></tr>
                  </thead>
                  <tbody>
                     {visits.map((v) => (
                        <tr key={v.id}>
                           <td className="cell-bold">{v.property?.title ?? "Propiedad"}</td>
                           <td>{new Date(v.scheduledDate).toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                           <td>
                              <span className={`nubia-badge ${statusColor[v.status] ?? "gray"}`}>
                                 {statusLabel[v.status] ?? v.status}
                              </span>
                           </td>
                           <td className="cell-muted">{v.notes ?? "—"}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </DashboardLayout>
   )
}

export default VisitsPage
