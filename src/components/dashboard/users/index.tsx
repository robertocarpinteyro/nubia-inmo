"use client"
import { useEffect, useState } from "react"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"

interface User { id: number; name: string; email: string; isActive: boolean; hasPurchased: boolean; createdAt: string }

const UsersPage = () => {
   const { getAuthHeaders } = useAuth()
   const [users, setUsers] = useState<User[]>([])
   const [loading, setLoading] = useState(true)
   const [filter, setFilter] = useState("")

   const load = (f = "") => {
      const qs = f ? `?filter=${f}` : ""
      fetch(`${API_BASE_URL}/admin/users${qs}`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => setUsers(Array.isArray(d) ? d : []))
         .catch(() => setUsers([]))
         .finally(() => setLoading(false))
   }

   useEffect(() => { load() }, [])

   const toggleActive = async (id: number, isActive: boolean) => {
      const action = isActive ? "deactivate" : "reactivate"
      await fetch(`${API_BASE_URL}/admin/users/${id}/${action}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
      load(filter)
   }

   const applyFilter = (f: string) => { setFilter(f); load(f) }

   return (
      <DashboardLayout title="Usuarios" allowedRoles={["admin"]}>
         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
               <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Gestión de Usuarios</h2>
               <p style={{ fontSize: 14, color: "rgba(0,0,0,0.4)", margin: 0 }}>{users.length} usuarios</p>
            </div>
            <div className="d-flex gap-2">
               {["", "agendaron", "compraron"].map((f) => (
                  <button key={f} className={`btn-nubia-sm ${filter === f ? "primary" : "ghost"}`} onClick={() => applyFilter(f)}>
                     {f === "" ? "Todos" : f === "agendaron" ? "Agendaron visita" : "Compradores"}
                  </button>
               ))}
            </div>
         </div>

         <div className="nubia-dash-card">
            {loading ? (
               <div className="nubia-loading"><div className="spinner"></div></div>
            ) : users.length === 0 ? (
               <div className="nubia-empty-state"><i className="bi bi-people"></i><p>Sin usuarios</p></div>
            ) : (
               <table className="nubia-table">
                  <thead>
                     <tr><th>Usuario</th><th>Estado</th><th>Comprador</th><th>Registro</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                     {users.map((u) => (
                        <tr key={u.id}>
                           <td>
                              <div className="cell-bold">{u.name}</div>
                              <div className="cell-muted">{u.email}</div>
                           </td>
                           <td><span className={`nubia-badge ${u.isActive ? "green" : "red"}`}>{u.isActive ? "Activo" : "Inactivo"}</span></td>
                           <td><span className={`nubia-badge ${u.hasPurchased ? "purple" : "gray"}`}>{u.hasPurchased ? "Sí" : "No"}</span></td>
                           <td className="cell-muted">{new Date(u.createdAt).toLocaleDateString("es-MX")}</td>
                           <td>
                              <button className={`btn-nubia-sm ${u.isActive ? "danger" : "outline"}`} onClick={() => toggleActive(u.id, u.isActive)}>
                                 {u.isActive ? "Desactivar" : "Reactivar"}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </DashboardLayout>
   )
}

export default UsersPage
