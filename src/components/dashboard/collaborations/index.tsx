"use client"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"

interface Agency {
   id: number
   name: string
   contactName?: string | null
   phone?: string | null
   email?: string | null
   notes?: string | null
   propertiesCount?: number
}

const empty = { name: "", contactName: "", phone: "", email: "", notes: "" }

const CollaborationsPage = () => {
   const [agencies, setAgencies] = useState<Agency[]>([])
   const [loading, setLoading] = useState(true)
   const [showModal, setShowModal] = useState(false)
   const [editing, setEditing] = useState<number | null>(null)
   const [form, setForm] = useState(empty)
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState("")

   const load = () => {
      fetch("/api/admin/agencies")
         .then((r) => r.json())
         .then((d) => setAgencies(Array.isArray(d) ? d : []))
         .catch(() => setAgencies([]))
         .finally(() => setLoading(false))
   }
   useEffect(() => { load() }, [])

   const openNew = () => { setEditing(null); setForm(empty); setError(""); setShowModal(true) }
   const openEdit = (a: Agency) => {
      setEditing(a.id)
      setForm({
         name: a.name || "", contactName: a.contactName || "", phone: a.phone || "",
         email: a.email || "", notes: a.notes || "",
      })
      setError(""); setShowModal(true)
   }

   const save = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!form.name.trim()) { setError("El nombre es obligatorio"); return }
      setSaving(true); setError("")
      try {
         const res = await fetch(
            editing ? `/api/admin/agencies/${editing}` : "/api/admin/agencies",
            {
               method: editing ? "PATCH" : "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(form),
            }
         )
         const d = await res.json()
         if (!res.ok) throw new Error(d.error || "No se pudo guardar")
         setShowModal(false)
         load()
      } catch (err: any) {
         setError(err.message || "Error")
      } finally {
         setSaving(false)
      }
   }

   const remove = async (id: number) => {
      if (!confirm("¿Eliminar esta inmobiliaria? Las propiedades y vendedores no se borran, solo se desvinculan.")) return
      await fetch(`/api/admin/agencies/${id}`, { method: "DELETE" })
      load()
   }

   return (
      <DashboardLayout title="Colaboraciones" allowedRoles={["admin"]}>
         <div className="nubia-dash-card" style={{ marginTop: 24 }}>
            <div className="card-head d-flex justify-content-between align-items-center mb-4">
               <div>
                  <h5 className="card-title">Inmobiliarias colaboradoras</h5>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
                     {agencies.length} {agencies.length === 1 ? "inmobiliaria" : "inmobiliarias"} registradas
                  </p>
               </div>
               <button className="btn-nubia-sm primary" onClick={openNew}>+ Nueva inmobiliaria</button>
            </div>

            {loading ? (
               <div className="nubia-loading"><div className="spinner"></div></div>
            ) : agencies.length === 0 ? (
               <div className="nubia-empty-state">
                  <i className="bi bi-briefcase"></i>
                  <p>Aún no registras inmobiliarias colaboradoras.</p>
               </div>
            ) : (
               <div style={{ overflowX: "auto" }}>
                  <table className="table" style={{ minWidth: 640 }}>
                     <thead>
                        <tr style={{ fontSize: 12, textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}>
                           <th>Inmobiliaria</th><th>Contacto</th><th>Teléfono</th><th>Email</th>
                           <th className="text-center">Propiedades</th><th></th>
                        </tr>
                     </thead>
                     <tbody>
                        {agencies.map((a) => (
                           <tr key={a.id} style={{ fontSize: 14 }}>
                              <td style={{ fontWeight: 700 }}>{a.name}</td>
                              <td>{a.contactName || "—"}</td>
                              <td>{a.phone || "—"}</td>
                              <td>{a.email || "—"}</td>
                              <td className="text-center">
                                 <span className="nubia-badge">{a.propertiesCount ?? 0}</span>
                              </td>
                              <td className="text-end">
                                 <button className="btn-nubia-sm" onClick={() => openEdit(a)} style={{ marginRight: 8 }}>Editar</button>
                                 <button onClick={() => remove(a.id)}
                                    style={{ border: "none", background: "none", color: "#F87171", fontSize: 13, cursor: "pointer" }}>
                                    Eliminar
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>

         {showModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
               onClick={() => setShowModal(false)}>
               <div className="nubia-dash-card" style={{ maxWidth: 480, width: "100%" }} onClick={(e) => e.stopPropagation()}>
                  <h5 className="card-title mb-3">{editing ? "Editar inmobiliaria" : "Nueva inmobiliaria"}</h5>
                  <form onSubmit={save} className="row g-3">
                     <div className="col-12"><div className="nubia-form-group"><label>Nombre *</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Grupo Inmobiliario XYZ" /></div></div>
                     <div className="col-md-6"><div className="nubia-form-group"><label>Contacto</label>
                        <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></div></div>
                     <div className="col-md-6"><div className="nubia-form-group"><label>Teléfono</label>
                        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div></div>
                     <div className="col-12"><div className="nubia-form-group"><label>Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div></div>
                     <div className="col-12"><div className="nubia-form-group"><label>Notas</label>
                        <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Acuerdos, comisión pactada, etc." /></div></div>
                     {error && <div className="col-12"><span style={{ fontSize: 13, color: "#F87171" }}>{error}</span></div>}
                     <div className="col-12 d-flex justify-content-end gap-2">
                        <button type="button" className="btn-nubia-sm" onClick={() => setShowModal(false)}>Cancelar</button>
                        <button type="submit" className="btn-nubia-sm primary" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </DashboardLayout>
   )
}

export default CollaborationsPage
