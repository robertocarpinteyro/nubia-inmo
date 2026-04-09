"use client"
import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { API_BASE_URL } from "@/context/AuthContext"
import HeaderTwo from "@/layouts/headers/HeaderTwo"
import NubiaFooter from "@/components/homes/home-two/NubiaFooter"

interface PropertyDetail {
   id: number
   title: string
   price: number
   discountPrice?: number
   address: string
   propertyType: string
   transactionType: string
   bedrooms: number
   bathrooms: number
   totalArea: number
   status: string
   description?: string
   images?: string[]
   parkingSpots?: number
   floors?: number
   yearBuilt?: number
   amenities?: string[]
}

const NubiaPropertyDetail = () => {
   const searchParams = useSearchParams()
   const id = searchParams.get("id")
   const [property, setProperty] = useState<PropertyDetail | null>(null)
   const [loading, setLoading] = useState(true)
   const [activeImg, setActiveImg] = useState(0)
   const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" })
   const [sent, setSent] = useState(false)
   const galleryRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (!id) return
      fetch(`${API_BASE_URL}/properties/${id}`)
         .then(r => r.json())
         .then(data => setProperty(data?.property || data))
         .catch(() => setProperty(null))
         .finally(() => setLoading(false))
   }, [id])

   const handleContact = (e: React.FormEvent) => {
      e.preventDefault()
      setSent(true)
      setContactForm({ name: "", email: "", phone: "", message: "" })
      setTimeout(() => setSent(false), 4000)
   }

   const formatPrice = (p: number) =>
      new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(p)

   const statusLabel: Record<string, { label: string; color: string }> = {
      available: { label: "Disponible", color: "#22C55E" },
      sold: { label: "Vendida", color: "#EF4444" },
      rented: { label: "Rentada", color: "#F59E0B" },
   }

   if (loading) {
      return (
         <div className="nubia-property-detail-page d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#0C0C0C" }}>
            <div style={{ textAlign: "center" }}>
               <div className="nubia-loader" />
               <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "24px", fontSize: "14px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Cargando propiedad</p>
            </div>
         </div>
      )
   }

   if (!property) {
      return (
         <div className="nubia-property-detail-page d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#0C0C0C" }}>
            <div style={{ textAlign: "center" }}>
               <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "80px", lineHeight: 1 }}>404</p>
               <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", letterSpacing: "0.1em", marginBottom: "32px" }}>Propiedad no encontrada</p>
               <Link href="/" className="btn-nubia-primary">Volver al inicio</Link>
            </div>
         </div>
      )
   }

   const images = property.images && property.images.length > 0 ? property.images : []
   const statusInfo = statusLabel[property.status] || { label: property.status, color: "#7B4FFF" }
   const isVenta = property.transactionType === "venta"

   return (
      <div className="nubia-home nubia-property-detail-page" style={{ background: "#0C0C0C", minHeight: "100vh" }}>
         <HeaderTwo style_1={false} style_2={false} nubia={true} />

         {/* ── BREADCRUMB ── */}
         <div style={{ paddingTop: "120px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="container">
               <div className="d-flex align-items-center gap-2" style={{ fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                  <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link>
                  <span>/</span>
                  <Link href="/listing-01" style={{ color: "inherit", textDecoration: "none" }}>Propiedades</Link>
                  <span>/</span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{property.title}</span>
               </div>
            </div>
         </div>

         {/* ── HERO HEADER ── */}
         <div style={{ padding: "48px 0 0" }}>
            <div className="container">
               <div className="row align-items-end g-4">
                  <div className="col-lg-8">
                     <div className="d-flex align-items-center gap-3 mb-20">
                        <span style={{
                           background: isVenta ? "#7B4FFF" : "#161616",
                           color: "#fff",
                           fontSize: "11px",
                           fontWeight: 700,
                           letterSpacing: "0.2em",
                           textTransform: "uppercase",
                           padding: "6px 14px",
                           borderRadius: "2px",
                           border: isVenta ? "none" : "1px solid rgba(255,255,255,0.15)"
                        }}>
                           {isVenta ? "Venta" : "Renta"}
                        </span>
                        <span style={{
                           background: "transparent",
                           color: statusInfo.color,
                           fontSize: "11px",
                           fontWeight: 700,
                           letterSpacing: "0.2em",
                           textTransform: "uppercase",
                           padding: "6px 14px",
                           borderRadius: "2px",
                           border: `1px solid ${statusInfo.color}40`
                        }}>
                           {statusInfo.label}
                        </span>
                     </div>
                     <h1 style={{
                        fontFamily: "Gordita, sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(2rem, 5vw, 56px)",
                        color: "#F5F5F2",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                        marginBottom: "16px"
                     }}>
                        {property.title}
                     </h1>
                     <div className="d-flex align-items-center gap-2" style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {property.address}
                     </div>
                  </div>
                  <div className="col-lg-4 text-lg-end">
                     <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Precio {isVenta ? "de venta" : "mensual"}
                     </div>
                     <div style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 48px)", color: "#7B4FFF", letterSpacing: "-0.02em", lineHeight: 1 }}>
                        {property.discountPrice && property.discountPrice > 0 ? (
                           <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                              <span style={{ fontSize: "0.5em", color: "rgba(255,255,255,0.4)", textDecoration: "line-through", marginBottom: "4px" }}>
                                 {formatPrice(property.price)}
                              </span>
                              <span>{formatPrice(property.discountPrice)}</span>
                           </div>
                        ) : (
                           formatPrice(property.price)
                        )}
                     </div>
                     {!isVenta && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "6px" }}>/mes</div>}
                  </div>
               </div>
            </div>
         </div>

         {/* ── GALLERY ── */}
         <div style={{ padding: "40px 0" }}>
            <div className="container">
               {images.length > 0 ? (
                  <div>
                     {/* Main image */}
                     <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", aspectRatio: "16/9", maxHeight: "560px", background: "#161616", marginBottom: "12px" }}>
                        <img
                           src={images[activeImg]}
                           alt={property.title}
                           style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        {images.length > 1 && (
                           <>
                              <button
                                 onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                                 style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", backdropFilter: "blur(8px)" }}
                              >
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                              </button>
                              <button
                                 onClick={() => setActiveImg(i => (i + 1) % images.length)}
                                 style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", backdropFilter: "blur(8px)" }}
                              >
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                              </button>
                              <div style={{ position: "absolute", bottom: "16px", right: "20px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "6px 14px", fontSize: "12px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>
                                 {activeImg + 1} / {images.length}
                              </div>
                           </>
                        )}
                     </div>
                     {/* Thumbnails */}
                     {images.length > 1 && (
                        <div className="d-flex gap-2 overflow-auto" style={{ scrollbarWidth: "none" }}>
                           {images.map((img, i) => (
                              <button
                                 key={i}
                                 onClick={() => setActiveImg(i)}
                                 style={{
                                    flexShrink: 0,
                                    width: "80px",
                                    height: "56px",
                                    borderRadius: "2px",
                                    overflow: "hidden",
                                    border: `2px solid ${activeImg === i ? "#7B4FFF" : "transparent"}`,
                                    padding: 0,
                                    cursor: "pointer",
                                    opacity: activeImg === i ? 1 : 0.5,
                                    transition: "all 0.2s"
                                 }}
                              >
                                 <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ) : (
                  <div style={{ borderRadius: "4px", background: "#161616", aspectRatio: "16/9", maxHeight: "560px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                     <div style={{ textAlign: "center" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" style={{ display: "block", margin: "0 auto 12px" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Sin imágenes</p>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* ── SPECS BAR ── */}
         <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#111111" }}>
            <div className="container">
               <div className="row g-0">
                  {[
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Tipo", value: property.propertyType },
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>, label: "Recámaras", value: `${property.bedrooms}` },
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M4 12h16M4 6h16M4 18h7"/></svg>, label: "Baños", value: `${property.bathrooms}` },
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M21 3H3v18h18V3z"/><path d="M3 9h18M9 21V9"/></svg>, label: "Superficie", value: `${property.totalArea} m²` },
                  ].map((spec, i) => (
                     <div key={i} className="col-6 col-md-3" style={{ padding: "28px 24px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                        <div className="d-flex align-items-center gap-3">
                           {spec.icon}
                           <div>
                              <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>{spec.label}</div>
                              <div style={{ fontSize: "18px", fontWeight: 700, color: "#F5F5F2", fontFamily: "Gordita, sans-serif" }}>{spec.value}</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* ── MAIN CONTENT + SIDEBAR ── */}
         <div style={{ padding: "64px 0 120px" }}>
            <div className="container">
               <div className="row g-5">

                  {/* ── LEFT COLUMN ── */}
                  <div className="col-xl-8">

                     {/* Description */}
                     <div style={{ background: "#111111", borderRadius: "4px", padding: "40px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: "20px" }}>
                           Descripción
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
                           {property.description || `Esta propiedad en ${property.address} ofrece una excelente oportunidad en el mercado inmobiliario. Con ${property.totalArea} m² de superficie, ${property.bedrooms} recámaras y ${property.bathrooms} baños, está pensada para quienes buscan comodidad y calidad de vida. Contáctanos para más información o para agendar una visita.`}
                        </p>
                     </div>

                     {/* Amenities */}
                     {property.amenities && property.amenities.length > 0 && (
                        <div style={{ background: "#111111", borderRadius: "4px", padding: "40px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                           <h3 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: "28px" }}>
                              Amenidades
                           </h3>
                           <div className="row g-3">
                              {property.amenities.map((a, i) => (
                                 <div key={i} className="col-6 col-md-4">
                                    <div className="d-flex align-items-center gap-2">
                                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                       <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{a}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Details grid */}
                     <div style={{ background: "#111111", borderRadius: "4px", padding: "40px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: "28px" }}>
                           Detalles de la propiedad
                        </h3>
                        <div className="row g-3">
                           {[
                              { label: "Tipo de propiedad", value: property.propertyType },
                              { label: "Transacción", value: isVenta ? "Venta" : "Renta" },
                              { label: "Recámaras", value: property.bedrooms },
                              { label: "Baños", value: property.bathrooms },
                              { label: "Superficie total", value: `${property.totalArea} m²` },
                              { label: "Estado", value: statusInfo.label },
                              ...(property.parkingSpots ? [{ label: "Estacionamientos", value: property.parkingSpots }] : []),
                              ...(property.floors ? [{ label: "Niveles", value: property.floors }] : []),
                              ...(property.yearBuilt ? [{ label: "Año de construcción", value: property.yearBuilt }] : []),
                           ].map((d, i) => (
                              <div key={i} className="col-6 col-md-4">
                                 <div style={{ padding: "16px", background: "#0C0C0C", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>{d.label}</div>
                                    <div style={{ fontSize: "15px", fontWeight: 600, color: "#F5F5F2" }}>{d.value}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Location */}
                     <div style={{ background: "#111111", borderRadius: "4px", padding: "40px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: "20px" }}>
                           Ubicación
                        </h3>
                        <div className="d-flex align-items-center gap-2 mb-24" style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                           {property.address}
                        </div>
                        <div style={{ background: "#0C0C0C", borderRadius: "2px", height: "240px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                           <div style={{ textAlign: "center" }}>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(123,79,255,0.4)" strokeWidth="1.5" style={{ display: "block", margin: "0 auto 12px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>Mapa próximamente</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* ── SIDEBAR ── */}
                  <div className="col-xl-4">
                     <div style={{ position: "sticky", top: "100px" }}>

                        {/* Price card */}
                        <div style={{ background: "#111111", borderRadius: "4px", padding: "32px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                           <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Precio {isVenta ? "de venta" : "mensual"}</div>
                           <div style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "36px", color: "#7B4FFF", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "24px" }}>
                              {property.discountPrice && property.discountPrice > 0 ? (
                                 <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                    <span style={{ fontSize: "0.5em", color: "rgba(255,255,255,0.4)", textDecoration: "line-through", marginBottom: "4px" }}>
                                       {formatPrice(property.price)}
                                    </span>
                                    <span>{formatPrice(property.discountPrice)}</span>
                                 </div>
                              ) : (
                                 formatPrice(property.price)
                              )}
                           </div>
                           <div className="d-flex gap-2">
                              <button className="btn-nubia-primary flex-fill" style={{ textAlign: "center" }}>
                                 Agendar visita
                              </button>
                              <button style={{ width: "44px", height: "44px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", flexShrink: 0, transition: "all 0.2s" }}
                                 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#7B4FFF"; (e.currentTarget as HTMLElement).style.color = "#7B4FFF" }}
                                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)" }}
                              >
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                              </button>
                           </div>
                        </div>

                        {/* Contact form */}
                        <div style={{ background: "#111111", borderRadius: "4px", padding: "32px", border: "1px solid rgba(255,255,255,0.06)" }}>
                           <h5 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 700, fontSize: "16px", color: "#F5F5F2", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "24px" }}>
                              Contactar
                           </h5>

                           {sent ? (
                              <div style={{ textAlign: "center", padding: "32px 0" }}>
                                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5" style={{ display: "block", margin: "0 auto 16px" }}><polyline points="20 6 9 17 4 12"/></svg>
                                 <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Mensaje enviado. Te contactaremos pronto.</p>
                              </div>
                           ) : (
                              <form onSubmit={handleContact}>
                                 {[
                                    { placeholder: "Tu nombre", key: "name", type: "text" },
                                    { placeholder: "Correo electrónico", key: "email", type: "email" },
                                    { placeholder: "Teléfono (opcional)", key: "phone", type: "tel" },
                                 ].map(({ placeholder, key, type }) => (
                                    <input
                                       key={key}
                                       type={type}
                                       placeholder={placeholder}
                                       value={contactForm[key as keyof typeof contactForm]}
                                       onChange={e => setContactForm(f => ({ ...f, [key]: e.target.value }))}
                                       required={key !== "phone"}
                                       style={{
                                          width: "100%",
                                          background: "#0C0C0C",
                                          border: "1px solid rgba(255,255,255,0.08)",
                                          borderRadius: "2px",
                                          padding: "12px 16px",
                                          color: "#F5F5F2",
                                          fontSize: "14px",
                                          marginBottom: "12px",
                                          outline: "none",
                                          display: "block",
                                       }}
                                    />
                                 ))}
                                 <textarea
                                    placeholder="Mensaje"
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                                    required
                                    style={{
                                       width: "100%",
                                       background: "#0C0C0C",
                                       border: "1px solid rgba(255,255,255,0.08)",
                                       borderRadius: "2px",
                                       padding: "12px 16px",
                                       color: "#F5F5F2",
                                       fontSize: "14px",
                                       marginBottom: "16px",
                                       outline: "none",
                                       resize: "vertical",
                                       display: "block",
                                       fontFamily: "inherit",
                                    }}
                                 />
                                 <button
                                    type="submit"
                                    className="btn-nubia-primary w-100"
                                    style={{ textAlign: "center" }}
                                 >
                                    Enviar mensaje
                                 </button>
                              </form>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <NubiaFooter />

         <style>{`
            .nubia-property-detail-page .btn-nubia-primary {
               display: inline-block;
               background: #7B4FFF;
               color: #fff;
               font-size: 12px;
               font-weight: 700;
               letter-spacing: 0.15em;
               text-transform: uppercase;
               padding: 13px 24px;
               border-radius: 2px;
               border: none;
               cursor: pointer;
               text-decoration: none;
               transition: background 0.2s;
            }
            .nubia-property-detail-page .btn-nubia-primary:hover {
               background: #9D7AFF;
               color: #fff;
            }
            .nubia-loader {
               width: 32px;
               height: 32px;
               border: 2px solid rgba(123,79,255,0.2);
               border-top-color: #7B4FFF;
               border-radius: 50%;
               animation: spin 0.8s linear infinite;
               margin: 0 auto;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            .nubia-property-detail-page input::placeholder,
            .nubia-property-detail-page textarea::placeholder {
               color: rgba(255,255,255,0.25);
            }
            .nubia-property-detail-page input:focus,
            .nubia-property-detail-page textarea:focus {
               border-color: rgba(123,79,255,0.5) !important;
            }
         `}</style>
      </div>
   )
}

export default NubiaPropertyDetail
