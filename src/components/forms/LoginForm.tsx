"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"

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
   const { login } = useAuth()
   const [loading, setLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)

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
         const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         const result = await res.json()
         if (res.ok) {
            login(result.token, result.user)
            toast.success("Sesión iniciada", { position: "top-center" })
            reset()
            closeModal()
            router.push("/dashboard/dashboard-index")
         } else {
            toast.error(result.error || "Email o contraseña inválidos")
         }
      } catch {
         toast.error("Error de conexión. Intenta de nuevo.")
      } finally {
         setLoading(false)
      }
   }

   const fieldStyle = inputStyle || {}
   const lStyle = labelStyle || {}

   const errorStyle: React.CSSProperties = {
      fontSize: 11, color: "#F87171", marginTop: 4, display: "block",
   }

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
            <Link href="#" style={{ fontSize: 13, color: "#9D7AFF", textDecoration: "none" }}>
               ¿Olvidaste tu contraseña?
            </Link>
         </div>

         {/* Submit */}
         <button
            type="submit"
            disabled={loading}
            style={{
               width: "100%",
               background: loading ? "rgba(123,79,255,0.5)" : "#7B4FFF",
               border: "none",
               borderRadius: 2,
               padding: "14px",
               color: "#fff",
               fontSize: 13,
               fontWeight: 700,
               letterSpacing: "0.1em",
               textTransform: "uppercase",
               cursor: loading ? "not-allowed" : "pointer",
               transition: "background 0.2s",
               marginTop: 4,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#6B3FEF" }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#7B4FFF" }}
         >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
         </button>
      </form>
   )
}

export default LoginForm
