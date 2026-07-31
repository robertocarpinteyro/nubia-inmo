"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const AccountSettingBody = () => {
   const supabase = createClient()
   const [pw, setPw] = useState("")
   const [pw2, setPw2] = useState("")
   const [loading, setLoading] = useState(false)
   const [msg, setMsg] = useState("")
   const [err, setErr] = useState("")

   const submit = async (e: React.FormEvent) => {
      e.preventDefault()
      setMsg("")
      setErr("")
      if (pw.length < 8) { setErr("La contraseña debe tener al menos 8 caracteres"); return }
      if (pw !== pw2) { setErr("Las contraseñas no coinciden"); return }
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password: pw })
      setLoading(false)
      if (error) {
         setErr(error.message)
      } else {
         setMsg("Contraseña actualizada correctamente")
         setPw("")
         setPw2("")
      }
   }

   return (
      <div className="nubia-dash-card" style={{ marginTop: 24 }}>
         <div className="card-head mb-3">
            <h5 className="card-title">Cambiar contraseña</h5>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
               Elige una contraseña nueva (mínimo 8 caracteres).
            </p>
         </div>
         <form onSubmit={submit} className="row g-3" style={{ maxWidth: 480 }}>
            <div className="col-12">
               <div className="nubia-form-group">
                  <label>Nueva contraseña</label>
                  <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mínimo 8 caracteres" />
               </div>
            </div>
            <div className="col-12">
               <div className="nubia-form-group">
                  <label>Confirmar contraseña</label>
                  <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repite la contraseña" />
               </div>
            </div>
            {err && <div className="col-12"><span style={{ fontSize: 13, color: "#F87171" }}>{err}</span></div>}
            {msg && <div className="col-12"><span style={{ fontSize: 13, color: "#10b981" }}>{msg}</span></div>}
            <div className="col-12">
               <button type="submit" className="btn-nubia-sm primary" disabled={loading}>
                  {loading ? "Guardando…" : "Actualizar contraseña"}
               </button>
            </div>
         </form>
      </div>
   )
}

export default AccountSettingBody
