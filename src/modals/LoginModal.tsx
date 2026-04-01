"use client"
import { useState } from "react"
import LoginForm from "@/components/forms/LoginForm"
import RegisterForm from "@/components/forms/RegisterForm"

const NAVY   = "#182D40"
const NAVY2  = "#1D3347"
const NAVY3  = "#142537"
const GOLD   = "#D9A76A"
const GOLD2  = "#E8C08E"
const WHITE  = "#F2F2F2"

const LoginModal = () => {
   const [activeTab, setActiveTab] = useState<"login" | "register">("login")

   const inputBase: React.CSSProperties = {
      width: "100%",
      background: NAVY2,
      border: `1px solid rgba(255,255,255,0.1)`,
      borderRadius: 4,
      padding: "13px 16px",
      color: WHITE,
      fontSize: 14,
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.2s",
   }

   const labelStyle: React.CSSProperties = {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "rgba(242,242,242,0.45)",
      display: "block",
      marginBottom: 6,
   }

   return (
      <div
         className="modal fade"
         id="loginModal"
         tabIndex={-1}
         aria-hidden="true"
         style={{ backdropFilter: "blur(6px)" }}
      >
         <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 460, margin: "auto", padding: "0 16px" }}>
            <div
               className="modal-content"
               style={{
                  background: NAVY,
                  border: `1px solid rgba(217,167,106,0.18)`,
                  borderRadius: 8,
                  boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(217,167,106,0.08)",
                  overflow: "hidden",
               }}
            >
               {/* ── Accent top bar ── */}
               <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD2} 100%)` }} />

               {/* ── Header ── */}
               <div style={{ padding: "32px 36px 0", position: "relative" }}>

                  {/* Close */}
                  <button
                     type="button"
                     data-bs-dismiss="modal"
                     aria-label="Close"
                     style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 4,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "rgba(242,242,242,0.5)",
                        fontSize: 18,
                        lineHeight: 1,
                        transition: "all 0.2s",
                     }}
                     onMouseEnter={e => {
                        e.currentTarget.style.background = `rgba(217,167,106,0.15)`
                        e.currentTarget.style.borderColor = `rgba(217,167,106,0.3)`
                        e.currentTarget.style.color = GOLD
                     }}
                     onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                        e.currentTarget.style.color = "rgba(242,242,242,0.5)"
                     }}
                  >
                     ×
                  </button>

                  {/* Logo */}
                  <div style={{ marginBottom: 28 }}>
                     <img
                        src="/assets/images/logo/Nubia_Logotipo.png"
                        alt="NUBIA"
                        style={{ height: 38, width: "auto" }}
                     />
                  </div>

                  {/* Tabs */}
                  <div style={{ display: "flex", gap: 0, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
                     {(["login", "register"] as const).map(tab => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: `2px solid ${activeTab === tab ? GOLD : "transparent"}`,
                              color: activeTab === tab ? WHITE : "rgba(242,242,242,0.35)",
                              fontSize: 12,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "0 0 14px",
                              marginRight: 28,
                              marginBottom: -1,
                              cursor: "pointer",
                              transition: "all 0.2s",
                           }}
                        >
                           {tab === "login" ? "Iniciar Sesión" : "Registrarse"}
                        </button>
                     ))}
                  </div>
               </div>

               {/* ── Body ── */}
               <div style={{ padding: "28px 36px 36px" }}>
                  {activeTab === "login" ? (
                     <>
                        <p style={{ fontSize: 14, color: "rgba(242,242,242,0.4)", marginBottom: 24 }}>
                           Bienvenido de nuevo — ingresa tus credenciales.
                        </p>
                        <LoginForm inputStyle={inputBase} labelStyle={labelStyle} />
                     </>
                  ) : (
                     <>
                        <p style={{ fontSize: 14, color: "rgba(242,242,242,0.4)", marginBottom: 24 }}>
                           Crea tu cuenta y empieza a explorar propiedades.
                        </p>
                        <RegisterForm inputStyle={inputBase} labelStyle={labelStyle} />
                     </>
                  )}

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                     <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                     <span style={{ fontSize: 10, color: "rgba(242,242,242,0.25)", letterSpacing: "0.12em", textTransform: "uppercase" }}>o continúa con</span>
                     <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                  </div>

                  {/* Google — próximamente */}
                  <button
                     disabled
                     style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 4,
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        cursor: "not-allowed",
                        opacity: 0.45,
                     }}
                  >
                     <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                     </svg>
                     <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(242,242,242,0.35)", letterSpacing: "0.04em" }}>
                        Google — Próximamente
                     </span>
                  </button>

                  {/* Switch tab */}
                  <p style={{ textAlign: "center", fontSize: 13, color: "rgba(242,242,242,0.3)", marginTop: 20, marginBottom: 0 }}>
                     {activeTab === "login" ? (
                        <>¿No tienes cuenta?{" "}
                           <button onClick={() => setActiveTab("register")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 }}>
                              Regístrate
                           </button>
                        </>
                     ) : (
                        <>¿Ya tienes cuenta?{" "}
                           <button onClick={() => setActiveTab("login")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 }}>
                              Inicia sesión
                           </button>
                        </>
                     )}
                  </p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default LoginModal
