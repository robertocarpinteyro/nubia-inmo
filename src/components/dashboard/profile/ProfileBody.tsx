"use client"
import { useState, useEffect } from "react"

const ProfileBody = () => {
   const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", about: "" })
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)
   const [msg, setMsg] = useState("")

   useEffect(() => {
      fetch("/api/me")
         .then((r) => r.json())
         .then((d) => setForm({
            name: d.name || "",
            email: d.email || "",
            phoneNumber: d.phoneNumber || "",
            about: d.about || "",
         }))
         .catch(() => {})
         .finally(() => setLoading(false))
   }, [])

   const handleSave = async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setMsg("")
      try {
         const res = await fetch("/api/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: form.name, phoneNumber: form.phoneNumber, about: form.about }),
         })
         setMsg(res.ok ? "Perfil actualizado" : "No se pudo guardar")
      } catch {
         setMsg("Error de conexión")
      } finally {
         setSaving(false)
         setTimeout(() => setMsg(""), 3000)
      }
   }

   if (loading) return <div className="nubia-loading"><div className="spinner"></div></div>

   return (
      <div className="nubia-dash-card" style={{ marginTop: 24 }}>
         <form onSubmit={handleSave} className="row g-3">
            <div className="col-md-6">
               <div className="nubia-form-group">
                  <label>Nombre completo</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
               </div>
            </div>
            <div className="col-md-6">
               <div className="nubia-form-group">
                  <label>Email <span style={{ opacity: 0.55, fontSize: 11 }}>(no editable)</span></label>
                  <input value={form.email} disabled />
               </div>
            </div>
            <div className="col-md-6">
               <div className="nubia-form-group">
                  <label>Teléfono / WhatsApp</label>
                  <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+52 ..." />
               </div>
            </div>
            <div className="col-12">
               <div className="nubia-form-group">
                  <label>Acerca de mí</label>
                  <textarea rows={4} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} placeholder="Cuéntanos un poco sobre ti…" />
               </div>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-end gap-3">
               {msg && <span style={{ fontSize: 13, color: msg.includes("actualiz") ? "#10b981" : "#F87171" }}>{msg}</span>}
               <button type="submit" className="btn-nubia-sm primary" disabled={saving}>
                  {saving ? "Guardando…" : "Guardar cambios"}
               </button>
            </div>
         </form>
      </div>
   )
}

export default ProfileBody
