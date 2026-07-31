"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const NAVY = "#182D40"
const NAVY2 = "#1D3347"
const GOLD = "#D9A76A"
const WHITE = "#F2F2F2"

export default function ResetPasswordPage() {
   const supabase = createClient()
   const router = useRouter()

   const [checking, setChecking] = useState(true)
   const [ready, setReady] = useState(false) // hay sesión de recuperación válida
   const [pw, setPw] = useState("")
   const [pw2, setPw2] = useState("")
   const [msg, setMsg] = useState("")
   const [loading, setLoading] = useState(false)
   const [done, setDone] = useState(false)

   useEffect(() => {
      // Supabase procesa el token del enlace del correo y emite el evento
      // PASSWORD_RECOVERY (o deja una sesión). Escuchamos ambos caminos.
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
         if (event === "PASSWORD_RECOVERY" || session) {
            setReady(true)
            setChecking(false)
         }
      })
      supabase.auth.getSession().then(({ data: { session } }) => {
         if (session) setReady(true)
         setChecking(false)
      })
      return () => subscription.unsubscribe()
   }, [supabase])

   const submit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (pw.length < 8) { setMsg("La contraseña debe tener al menos 8 caracteres"); return }
      if (pw !== pw2) { setMsg("Las contraseñas no coinciden"); return }
      setLoading(true)
      setMsg("")
      const { error } = await supabase.auth.updateUser({ password: pw })
      setLoading(false)
      if (error) {
         setMsg(error.message)
      } else {
         setDone(true)
         setTimeout(() => router.push("/"), 2500)
      }
   }

   const input: React.CSSProperties = {
      width: "100%", background: NAVY2, border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 4, padding: "13px 16px", color: WHITE, fontSize: 14, outline: "none",
   }
   const label: React.CSSProperties = {
      fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color: "rgba(242,242,242,0.45)", display: "block", marginBottom: 6,
   }

   return (
      <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
         <div style={{ width: "100%", maxWidth: 440, background: "#142537", border: "1px solid rgba(217,167,106,0.18)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD}, #E8C08E)` }} />
            <div style={{ padding: "36px" }}>
               <img src="/assets/images/logo/Nubia_Logotipo.png" alt="NUBIA" style={{ height: 34, width: "auto", marginBottom: 24 }} />
               <h1 style={{ fontSize: 22, fontWeight: 800, color: WHITE, marginBottom: 8 }}>Nueva contraseña</h1>

               {checking ? (
                  <p style={{ color: "rgba(242,242,242,0.5)", fontSize: 14 }}>Verificando enlace…</p>
               ) : done ? (
                  <div>
                     <p style={{ color: WHITE, fontSize: 15, lineHeight: 1.6 }}>
                        ✓ Tu contraseña se actualizó. Te llevamos al inicio…
                     </p>
                  </div>
               ) : !ready ? (
                  <div>
                     <p style={{ color: "rgba(242,242,242,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                        Este enlace no es válido o ya expiró. Solicita uno nuevo desde
                        «¿Olvidaste tu contraseña?» al iniciar sesión.
                     </p>
                     <Link href="/" style={{ color: GOLD, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                        ← Volver al inicio
                     </Link>
                  </div>
               ) : (
                  <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
                     <p style={{ color: "rgba(242,242,242,0.4)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                        Elige una contraseña nueva (mínimo 8 caracteres).
                     </p>
                     <div>
                        <label style={label}>Nueva contraseña</label>
                        <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Mínimo 8 caracteres" style={input} />
                     </div>
                     <div>
                        <label style={label}>Confirmar contraseña</label>
                        <input type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Repite la contraseña" style={input} />
                     </div>
                     {msg && <span style={{ fontSize: 12, color: "#F87171" }}>{msg}</span>}
                     <button
                        type="submit"
                        disabled={loading}
                        style={{
                           width: "100%", background: loading ? "rgba(123,79,255,0.5)" : "#7B4FFF",
                           border: "none", borderRadius: 2, padding: "14px", color: "#fff", fontSize: 13,
                           fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                           cursor: loading ? "not-allowed" : "pointer",
                        }}
                     >
                        {loading ? "Guardando…" : "Actualizar contraseña"}
                     </button>
                  </form>
               )}
            </div>
         </div>
      </div>
   )
}
