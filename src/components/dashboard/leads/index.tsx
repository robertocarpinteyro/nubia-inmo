"use client"
import { useEffect, useState } from "react"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"

interface Lead {
   id: number
   name: string
   email: string
   phone?: string
   source: string
   status: string
   notes?: string
   createdAt: string
}

const LeadsPage = () => {
   const { getAuthHeaders, user } = useAuth()
   const [leads, setLeads] = useState<Lead[]>([])
   const [loading, setLoading] = useState(true)
   const [showModal, setShowModal] = useState(false)
   const [form, setForm] = useState({ name: "", email: "", phone: "", source: "website", notes: "" })
   const [saving, setSaving] = useState(false)

   const load = () => {
      fetch(`${API_BASE_URL}/leads/me`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => setLeads(Array.isArray(d) ? d : []))
         .catch(() => setLeads([]))
         .finally(() => setLoading(false))
   }

   useEffect(() => { load() }, [])

   const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      try {
         await fetch(`${API_BASE_URL}/leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify(form),
         })
         setShowModal(false)
         setForm({ name: "", email: "", phone: "", source: "website", notes: "" })
         load()
      } finally {
         setSaving(false)
      }
   }

   const sourceColor: Record<string, string> = { website: "blue", manual: "amber", referral: "green" }
   const statusColor: Record<string, string> = { new: "purple", contacted: "amber", qualified: "green", lost: "red" }

   return (
      <DashboardLayout title="Leads" allowedRoles={["vendedor", "admin"]}>
         <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
               <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Mis Leads</h2>
               <p style={{ fontSize: 14, color: "rgba(0,0,0,0.4)", margin: 0 }}>{leads.length} contactos en seguimiento</p>
            </div>
            <button className="btn-nubia-sm primary" onClick={() => setShowModal(true)}>
               <i className="bi bi-plus-circle"></i> Nuevo Lead
            </button>
         </div>

         <div className="nubia-dash-card">
            {loading ? (
               <div className="nubia-loading"><div className="spinner"></div></div>
            ) : leads.length === 0 ? (
               <div className="nubia-empty-state">
                  <i className="bi bi-funnel"></i>
                  <p>No tienes leads registrados. Agrega tu primer contacto.</p>
               </div>
            ) : (
               <table className="nubia-table">
                  <thead>
                     <tr><th>Contacto</th><th>Teléfono</th><th>Fuente</th><th>Estado</th><th>Fecha</th></tr>
                  </thead>
                  <tbody>
                     {leads.map((l) => (
                        <tr key={l.id}>
                           <td>
                              <div className="cell-bold">{l.name}</div>
                              <div className="cell-muted">{l.email}</div>
                           </td>
                           <td className="cell-muted">{l.phone ?? "—"}</td>
                           <td><span className={`nubia-badge ${sourceColor[l.source] ?? "gray"}`}>{l.source}</span></td>
                           <td><span className={`nubia-badge ${statusColor[l.status] ?? "gray"}`}>{l.status}</span></td>
                           <td className="cell-muted">{new Date(l.createdAt).toLocaleDateString("es-MX")}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>

         {showModal && (
            <div className="nubia-modal-overlay" onClick={() => setShowModal(false)}>
               <div className="nubia-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-head">
                     <h3>Nuevo Lead</h3>
                     <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
                  </div>
                  <form onSubmit={handleCreate}>
                     <div className="modal-body">
                        <div className="nubia-form-group">
                           <label>Nombre</label>
                           <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Nombre del contacto" />
                        </div>
                        <div className="nubia-form-group">
                           <label>Email</label>
                           <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="email@ejemplo.com" />
                        </div>
                        <div className="nubia-form-group">
                           <label>Teléfono</label>
                           <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+52 (55) 1234-5678" />
                        </div>
                        <div className="nubia-form-group">
                           <label>Fuente</label>
                           <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                              <option value="website">Website</option>
                              <option value="manual">Manual</option>
                              <option value="referral">Referido</option>
                           </select>
                        </div>
                        <div className="nubia-form-group" style={{ marginBottom: 0 }}>
                           <label>Notas</label>
                           <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas adicionales..." />
                        </div>
                     </div>
                     <div className="modal-footer">
                        <button type="button" className="btn-nubia-sm ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                        <button type="submit" className="btn-nubia-sm primary" disabled={saving}>
                           {saving ? "Guardando…" : "Crear Lead"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </DashboardLayout>
   )
}

export default LeadsPage
