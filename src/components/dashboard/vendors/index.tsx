"use client"
import { useEffect, useState } from "react"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"

interface Vendor {
   id: number
   name: string
   email: string
   isActive: boolean
   propertiesCount?: number
   propertiesSold?: number
}

interface NewVendorForm { name: string; email: string; password: string }

const VendorsPage = () => {
   const { getAuthHeaders } = useAuth()
   const [vendors, setVendors] = useState<Vendor[]>([])
   const [loading, setLoading] = useState(true)
   const [showModal, setShowModal] = useState(false)
   const [form, setForm] = useState<NewVendorForm>({ name: "", email: "", password: "" })
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState("")

   const load = () => {
      const h = { "Content-Type": "application/json", ...getAuthHeaders() }
      fetch(`${API_BASE_URL}/admin/vendors`, { headers: h })
         .then((r) => r.json())
         .then((d) => setVendors(Array.isArray(d) ? d : []))
         .catch(() => setVendors([]))
         .finally(() => setLoading(false))
   }

   useEffect(() => { load() }, [])

   const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError("")
      try {
         const res = await fetch(`${API_BASE_URL}/admin/vendors`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify(form),
         })
         const data = await res.json()
         if (!res.ok) throw new Error(data.message || "Error al crear vendedor")
         setShowModal(false)
         setForm({ name: "", email: "", password: "" })
         load()
      } catch (err: any) {
         setError(err.message)
      } finally {
         setSaving(false)
      }
   }

   const toggleActive = async (id: number, isActive: boolean) => {
      const h = { "Content-Type": "application/json", ...getAuthHeaders() }
      const action = isActive ? "deactivate" : "reactivate"
      await fetch(`${API_BASE_URL}/admin/users/${id}/${action}`, { method: "PUT", headers: h })
      load()
   }

   return (
      <DashboardLayout title="Vendedores" allowedRoles={["admin"]}>
         <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
               <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Gestión de Vendedores</h2>
               <p style={{ fontSize: 14, color: "rgba(0,0,0,0.4)", margin: 0 }}>{vendors.length} vendedores en la red</p>
            </div>
            <button className="btn-nubia-sm primary" onClick={() => setShowModal(true)}>
               <i className="bi bi-person-plus"></i> Nuevo Vendedor
            </button>
         </div>

         <div className="nubia-dash-card">
            {loading ? (
               <div className="nubia-loading"><div className="spinner"></div></div>
            ) : vendors.length === 0 ? (
               <div className="nubia-empty-state">
                  <i className="bi bi-people"></i>
                  <p>No hay vendedores. Crea el primero.</p>
               </div>
            ) : (
               <table className="nubia-table">
                  <thead>
                     <tr>
                        <th>Vendedor</th>
                        <th>Propiedades</th>
                        <th>Vendidas</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                     </tr>
                  </thead>
                  <tbody>
                     {vendors.map((v) => (
                        <tr key={v.id}>
                           <td>
                              <div className="cell-bold">{v.name}</div>
                              <div className="cell-muted">{v.email}</div>
                           </td>
                           <td><span className="nubia-badge purple">{v.propertiesCount ?? 0}</span></td>
                           <td><span className="nubia-badge green">{v.propertiesSold ?? 0}</span></td>
                           <td>
                              <span className={`nubia-badge ${v.isActive ? "green" : "red"}`}>
                                 {v.isActive ? "Activo" : "Inactivo"}
                              </span>
                           </td>
                           <td>
                              <button
                                 className={`btn-nubia-sm ${v.isActive ? "danger" : "outline"}`}
                                 onClick={() => toggleActive(v.id, v.isActive)}
                              >
                                 {v.isActive ? "Desactivar" : "Reactivar"}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>

         {/* Modal crear vendedor */}
         {showModal && (
            <div className="nubia-modal-overlay" onClick={() => setShowModal(false)}>
               <div className="nubia-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-head">
                     <h3>Nuevo Vendedor</h3>
                     <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
                  </div>
                  <form onSubmit={handleCreate}>
                     <div className="modal-body">
                        {error && (
                           <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", color: "#c53030", fontSize: 14, marginBottom: 16 }}>
                              {error}
                           </div>
                        )}
                        <div className="nubia-form-group">
                           <label>Nombre completo</label>
                           <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Ej. María García" />
                        </div>
                        <div className="nubia-form-group">
                           <label>Email</label>
                           <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="vendedor@nubia.mx" />
                        </div>
                        <div className="nubia-form-group" style={{ marginBottom: 0 }}>
                           <label>Contraseña temporal</label>
                           <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Mínimo 6 caracteres" minLength={6} />
                        </div>
                     </div>
                     <div className="modal-footer">
                        <button type="button" className="btn-nubia-sm ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                        <button type="submit" className="btn-nubia-sm primary" disabled={saving}>
                           {saving ? "Creando…" : "Crear Vendedor"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </DashboardLayout>
   )
}

export default VendorsPage
