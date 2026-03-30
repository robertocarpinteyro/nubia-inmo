"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/context/AuthContext"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

interface Property {
   id: number
   title: string
   price: number
   currency: string
   transactionType: string
   city?: string
   state?: string
   address?: string
   media?: { url: string; mediaType: string }[]
}

const formatPrice = (price: number, currency: string) =>
   new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

// Isotipo NUBIA con fallback
const NubiaIsotipo = () => {
   const [err, setErr] = useState(false)
   if (err) return <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.1em", color: "#F5F5F2" }}>N</span>
   return (
      <img
         src="/assets/images/logo/Nubia_isotipo.png"
         alt="NUBIA"
         height={32}
         style={{ height: 32, width: "auto" }}
         onError={() => setErr(true)}
      />
   )
}

const NubiaLogotipo = () => {
   const [err, setErr] = useState(false)
   if (err) return <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.1em", color: "#F5F5F2" }}>NUBIA</span>
   return (
      <img
         src="/assets/images/logo/Nubia_Logotipo.png"
         alt="NUBIA"
         height={26}
         style={{ height: 26, width: "auto" }}
         onError={() => setErr(true)}
      />
   )
}

const Offcanvas = ({ offCanvas, setOffCanvas }: any) => {
   const [properties, setProperties] = useState<Property[]>([])
   const [loading, setLoading] = useState(false)
   const { user, isAuthenticated, logout } = useAuth()
   const { t, lang } = useLanguage()

   const firstName = user?.name?.split(" ")[0] || ""
   const initials = user?.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "U"
   const roleLabel: Record<string, string> = { admin: "Administrador", vendedor: "Vendedor", usuario: "Usuario" }

   useEffect(() => {
      if (!offCanvas) return
      setLoading(true)
      fetch(`${API_BASE_URL}/properties?limit=3&featured=true`)
         .then(r => r.json())
         .then(data => {
            const list: Property[] = data?.properties || []
            if (list.length === 0) {
               return fetch(`${API_BASE_URL}/properties?limit=3`)
                  .then(r => r.json())
                  .then(d => setProperties(d?.properties || []))
            }
            setProperties(list)
         })
         .catch(() => setProperties([]))
         .finally(() => setLoading(false))
   }, [offCanvas])

   const getImage = (p: Property) => p.media?.find(m => m.mediaType === "image")?.url || null
   const locationLabel = (p: Property) => p.city && p.state ? `${p.city}, ${p.state}` : p.city || p.address || ""

   return (
      <>
         {/* ── Panel ── */}
         <div style={{
            position: "fixed",
            top: 0,
            right: offCanvas ? 0 : "-460px",
            width: 440,
            maxWidth: "100vw",
            height: "100vh",
            background: "#0C0C0C",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            zIndex: 9999,
            transition: "right 0.38s cubic-bezier(0.4,0,0.2,1)",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            scrollbarWidth: "none",
         }}>

            {/* ── Header ── */}
            <div style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               padding: "28px 32px",
               borderBottom: "1px solid rgba(255,255,255,0.06)",
               flexShrink: 0,
            }}>
               <Link href="/" onClick={() => setOffCanvas(false)} style={{ textDecoration: "none" }}>
                  <NubiaLogotipo />
               </Link>
               <button
                  onClick={() => setOffCanvas(false)}
                  style={{
                     background: "rgba(255,255,255,0.06)",
                     border: "1px solid rgba(255,255,255,0.1)",
                     borderRadius: "50%",
                     width: 36,
                     height: 36,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     cursor: "pointer",
                     color: "rgba(255,255,255,0.6)",
                     transition: "all 0.2s",
                     flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                     (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"
                     ;(e.currentTarget as HTMLElement).style.color = "#fff"
                  }}
                  onMouseLeave={e => {
                     (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"
                     ;(e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"
                  }}
               >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
               </button>
            </div>

            {/* ── Auth section ── */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
               {isAuthenticated ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                     {/* Avatar */}
                     <div style={{
                        width: 48, height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #7B4FFF, #9D7AFF)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 15, fontWeight: 700, color: "#fff",
                        flexShrink: 0, letterSpacing: "0.05em",
                     }}>
                        {initials}
                     </div>
                     {/* Info */}
                     <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F2", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                           {user?.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#7B4FFF", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                           {roleLabel[user?.role || ""] || user?.role}
                        </div>
                     </div>
                     {/* Actions */}
                     <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <Link
                           href="/dashboard/dashboard-index"
                           target="_blank"
                           onClick={() => setOffCanvas(false)}
                           title="Dashboard"
                           style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: "rgba(123,79,255,0.15)",
                              border: "1px solid rgba(123,79,255,0.3)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#9D7AFF", textDecoration: "none",
                              transition: "all 0.2s",
                           }}
                        >
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                           </svg>
                        </Link>
                        <button
                           onClick={() => { logout(); setOffCanvas(false) }}
                           title="Cerrar sesión"
                           style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "rgba(255,255,255,0.4)", cursor: "pointer",
                              transition: "all 0.2s",
                           }}
                           onMouseEnter={e => {
                              ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"
                              ;(e.currentTarget as HTMLElement).style.color = "#EF4444"
                           }}
                           onMouseLeave={e => {
                              ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"
                              ;(e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"
                           }}
                        >
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                           </svg>
                        </button>
                     </div>
                  </div>
               ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
                           {lang === "es" ? "Accede a tu cuenta para gestionar propiedades" : "Sign in to manage your properties"}
                        </div>
                        <a
                           href="#"
                           data-bs-toggle="modal"
                           data-bs-target="#loginModal"
                           onClick={() => setOffCanvas(false)}
                           style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              background: "#7B4FFF",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 700,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              padding: "10px 20px",
                              borderRadius: 2,
                              textDecoration: "none",
                              transition: "background 0.2s",
                           }}
                        >
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                           </svg>
                           {lang === "es" ? "Iniciar sesión" : "Sign in"}
                        </a>
                     </div>
                  </div>
               )}
            </div>

            {/* ── Propiedades destacadas ── */}
            <div style={{ padding: "28px 32px", flex: 1 }}>
               <div style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  fontWeight: 700,
                  marginBottom: 20,
               }}>
                  {lang === "es" ? "Propiedades destacadas" : "Featured properties"}
               </div>

               {loading && (
                  <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "16px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                     <div style={{
                        width: 16, height: 16,
                        border: "2px solid rgba(123,79,255,0.3)",
                        borderTopColor: "#7B4FFF",
                        borderRadius: "50%",
                        animation: "nubia-spin 0.8s linear infinite",
                     }} />
                     Cargando...
                  </div>
               )}

               {!loading && properties.length === 0 && (
                  <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, padding: "16px 0" }}>
                     Sin propiedades disponibles
                  </div>
               )}

               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {properties.map(p => {
                     const img = getImage(p)
                     return (
                        <Link
                           key={p.id}
                           href={`/listing_details_06?id=${p.id}`}
                           onClick={() => setOffCanvas(false)}
                           style={{ textDecoration: "none" }}
                        >
                           <div style={{
                              display: "flex",
                              gap: 14,
                              background: "#111111",
                              borderRadius: 3,
                              border: "1px solid rgba(255,255,255,0.06)",
                              padding: 12,
                              transition: "border-color 0.2s",
                              cursor: "pointer",
                           }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,79,255,0.35)"}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"}
                           >
                              {/* Imagen */}
                              <div style={{
                                 width: 72, height: 60,
                                 borderRadius: 2,
                                 overflow: "hidden",
                                 flexShrink: 0,
                                 background: "#1a1a1a",
                              }}>
                                 {img ? (
                                    <img src={img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                 ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                       </svg>
                                    </div>
                                 )}
                              </div>
                              {/* Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                 <div style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: p.transactionType === "venta" ? "#7B4FFF" : "rgba(255,255,255,0.35)",
                                    marginBottom: 4,
                                 }}>
                                    {p.transactionType === "venta" ? "Venta" : "Renta"}
                                 </div>
                                 <div style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>
                                    {formatPrice(p.price, p.currency || "MXN")}
                                 </div>
                                 <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {locationLabel(p) || p.title}
                                 </div>
                              </div>
                              {/* Arrow */}
                              <div style={{ display: "flex", alignItems: "center", flexShrink: 0, color: "rgba(255,255,255,0.2)" }}>
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                 </svg>
                              </div>
                           </div>
                        </Link>
                     )
                  })}
               </div>

               {/* Ver todas */}
               <Link
                  href="/listing-01"
                  onClick={() => setOffCanvas(false)}
                  style={{
                     display: "flex",
                     alignItems: "center",
                     gap: 8,
                     marginTop: 16,
                     fontSize: 12,
                     fontWeight: 700,
                     letterSpacing: "0.1em",
                     textTransform: "uppercase",
                     color: "#7B4FFF",
                     textDecoration: "none",
                     transition: "gap 0.2s",
                  }}
               >
                  {lang === "es" ? "Ver todas las propiedades" : "View all properties"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                     <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
               </Link>
            </div>

            {/* ── Footer del panel ── */}
            <div style={{
               padding: "24px 32px",
               borderTop: "1px solid rgba(255,255,255,0.06)",
               flexShrink: 0,
            }}>
               {/* Contacto */}
               <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: 10 }}>
                     Contacto
                  </div>
                  <Link href="tel:+528112345678" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none", marginBottom: 6 }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                     +52 (81) 1234-5678
                  </Link>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                     Monterrey, Nuevo León
                  </div>
               </div>

               {/* Redes sociales */}
               <div style={{ display: "flex", gap: 8 }}>
                  {[
                     { icon: <path d="M21 2H3v16l4-4h14V2zM9 9a1 1 0 110-2 1 1 0 010 2zm3 0a1 1 0 110-2 1 1 0 010 2zm3 0a1 1 0 110-2 1 1 0 010 2z" />, href: "#", label: "WhatsApp" },
                     { icon: <><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></>, href: "#", label: "Twitter" },
                     { icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>, href: "#", label: "Instagram" },
                     { icon: <><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></>, href: "#", label: "Facebook" },
                  ].map((s, i) => (
                     <Link key={i} href={s.href} aria-label={s.label} style={{
                        width: 36, height: 36,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "rgba(255,255,255,0.4)",
                        transition: "all 0.2s",
                     }}
                        onMouseEnter={e => {
                           ;(e.currentTarget as HTMLElement).style.background = "rgba(123,79,255,0.15)"
                           ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(123,79,255,0.4)"
                           ;(e.currentTarget as HTMLElement).style.color = "#9D7AFF"
                        }}
                        onMouseLeave={e => {
                           ;(e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"
                           ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"
                           ;(e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"
                        }}
                     >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           {s.icon}
                        </svg>
                     </Link>
                  ))}
               </div>
            </div>
         </div>

         {/* ── Backdrop ── */}
         <div
            onClick={() => setOffCanvas(false)}
            style={{
               position: "fixed",
               inset: 0,
               background: "rgba(0,0,0,0.7)",
               backdropFilter: "blur(4px)",
               zIndex: 9998,
               opacity: offCanvas ? 1 : 0,
               pointerEvents: offCanvas ? "auto" : "none",
               transition: "opacity 0.38s ease",
            }}
         />

         <style>{`
            @keyframes nubia-spin { to { transform: rotate(360deg); } }
         `}</style>
      </>
   )
}

export default Offcanvas
