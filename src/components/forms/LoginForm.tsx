"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth } from "@/context/AuthContext"
import { createClient } from "@/lib/supabase/client"

interface FormData {
   email: string
   password: string
}

interface Props {
   inputStyle?: React.CSSProperties
   labelStyle?: React.CSSProperties
}

const LoginForm = ({ inputStyle, labelStyle }: Props) => {
   const router = useRouter()
   const { signIn } = useAuth()
   const supabase = createClient()
   const [loading, setLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)

   // Modo de recuperación de contraseña.
   const [mode, setMode] = useState<"login" | "forgot">("login")
   const [forgotEmail, setForgotEmail] = useState("")
   const [forgotLoading, setForgotLoading] = useState(false)
   const [forgotSent, setForgotSent] = useState(false)

   const schema = yup.object({
      email: yup.string().required("El email es obligatorio").email("Email inválido"),
      password: yup.string().required("La contraseña es obligatoria"),
   }).required()

   const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) })

   const closeModal = () => {
      const modalEl = document.getElementById("loginModal")
      if (modalEl) {
         const bs = (window as any).bootstrap
         if (bs) bs.Modal.getInstance(modalEl)?.hide()
      }
      document.querySelectorAll(".modal-backdrop").forEach(el => el.remove())
      document.body.classList.remove("modal-open")
      document.body.style.removeProperty("overflow")
      document.body.style.removeProperty("padding-right")
   }

   const onSubmit = async (data: FormData) => {
      setLoading(true)
      try {
         const { error } = await signIn(data.email, data.password)
         if (!error) {
            toast.success("Sesión iniciada", { position: "top-center" })
            reset()
            closeModal()
            router.push("/dashboard/dashboard-index")
         } else {
            toast.error("Email o contraseña inválidos")
         }
      } catch {
         toast.error("Error de conexión. Intenta de nuevo.")
      } finally {
         setLoading(false)
      }
   }

   const onForgot = async () => {
      const email = forgotEmail.trim()
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
         toast.error("Ingresa un email válido")
         return
      }
      setForgotLoading(true)
      try {
         const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
         })
         if (error) {
            toast.error(error.message)
         } else {
            // Mensaje neutro: no revela si el correo existe o no.
            setForgotSent(true)
         }
      } catch {
         toast.error("Error de conexión. Intenta de nuevo.")
      } finally {
         setForgotLoading(false)
      }
   }

   const fieldStyle = inputStyle || {}
   const lStyle = labelStyle || {}

   const errorStyle: React.CSSProperties = {
      fontSize: 11, color: "#F87171", marginTop: 4, display: "block",
   }

   const primaryBtn = (label: string, busy: boolean): React.CSSProperties => ({
      width: "100%",
      background: busy ? "rgba(123,79,255,0.5)" : "#7B4FFF",
      border: "none",
      borderRadius: 2,
      padding: "14px",
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      cursor: busy ? "not-allowed" : "pointer",
      transition: "background 0.2s",
      marginTop: 4,
   })

   // ── Vista: recuperar contraseña ──────────────────────────────────
   if (mode === "forgot") {
      return (
         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {forgotSent ? (
               <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
                     Si el correo está registrado, te enviamos un enlace para restablecer tu
                     contraseña. Revisa tu bandeja de entrada (y spam).
                  </p>
               </div>
            ) : (
               <>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>
                     Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                  <div>
                     <label style={lStyle}>Email</label>
                     <input
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="tucorreo@gmail.com"
                        style={fieldStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                     />
                  </div>
                  <button type="button" onClick={onForgot} disabled={forgotLoading} style={primaryBtn("", forgotLoading)}>
                     {forgotLoading ? "Enviando…" : "Enviar enlace"}
                  </button>
               </>
            )}
            <button
               type="button"
               onClick={() => { setMode("login"); setForgotSent(false) }}
               style={{ background: "none", border: "none", color: "#9D7AFF", cursor: "pointer", fontSize: 13, padding: 0, marginTop: 4 }}
            >
               ← Volver a iniciar sesión
            </button>
         </div>
      )
   }

   // ── Vista: iniciar sesión ────────────────────────────────────────
   return (
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
         {/* Email */}
         <div>
            <label style={lStyle}>Email</label>
            <input
               type="email"
               {...register("email")}
               placeholder="tucorreo@gmail.com"
               style={fieldStyle}
               onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
               onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            {errors.email && <span style={errorStyle}>{errors.email.message}</span>}
         </div>

         {/* Password */}
         <div>
            <label style={lStyle}>Contraseña</label>
            <div style={{ position: "relative" }}>
               <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Tu contraseña"
                  style={{ ...fieldStyle, paddingRight: 44 }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(123,79,255,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
               />
               <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                     position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                     background: "none", border: "none", cursor: "pointer",
                     color: "rgba(255,255,255,0.3)", padding: 0,
                  }}
               >
                  {showPassword ? (
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
               </button>
            </div>
            {errors.password && <span style={errorStyle}>{errors.password.message}</span>}
         </div>

         {/* Remember + forgot */}
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
               <input type="checkbox" style={{ accentColor: "#7B4FFF" }} />
               Mantener sesión
            </label>
            <button
               type="button"
               onClick={() => setMode("forgot")}
               style={{ background: "none", border: "none", fontSize: 13, color: "#9D7AFF", cursor: "pointer", padding: 0 }}
            >
               ¿Olvidaste tu contraseña?
            </button>
         </div>

         {/* Submit */}
         <button type="submit" disabled={loading} style={primaryBtn("", loading)}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
         </button>
      </form>
   )
}

export default LoginForm
