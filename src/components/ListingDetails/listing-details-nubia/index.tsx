"use client"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { API_BASE_URL } from "@/context/AuthContext"
import HeaderTwo from "@/layouts/headers/HeaderTwo"
import NubiaFooter from "@/components/homes/home-two/NubiaFooter"

interface MediaItem {
   id: number
   mediaType: string
   url: string
   title?: string
   sortOrder: number
}

interface PropertyDetail {
   id: number
   title: string
   titleEn?: string
   price: number
   discountPrice?: number
   currency?: string
   address?: string
   city?: string
   state?: string
   propertyType: string
   transactionType: string
   bedrooms?: number
   bathrooms?: string
   totalArea?: number
   builtArea?: number
   parkingSpaces?: number
   yearBuilt?: number
   status: string
   description?: string
   descriptionEn?: string
   videoUrl?: string
   googleMapsUrl?: string
   media?: MediaItem[]
   featured?: boolean
}

// Detecta si el URL es YouTube, Vimeo o video directo
function parseVideoUrl(url: string): { type: "youtube" | "vimeo" | "direct"; embedSrc: string } | null {
   if (!url) return null
   const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/)
   if (yt) {
      const id = yt[1]
      return { type: "youtube", embedSrc: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3` }
   }
   const vm = url.match(/vimeo\.com\/(\d+)/)
   if (vm) {
      return { type: "vimeo", embedSrc: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&muted=1&loop=1&background=1` }
   }
   return { type: "direct", embedSrc: url }
}

// Convierte URL de Google Maps share a embed
function toMapsEmbed(url: string): string {
   if (!url) return ""
   if (url.includes("/embed")) return url
   // Si viene de maps.google.com o google.com/maps, convertir a embed
   const qMatch = url.match(/[?&]q=([^&]+)/)
   if (qMatch) return `https://maps.google.com/maps?q=${qMatch[1]}&z=15&output=embed`
   return url
}

const NubiaPropertyDetail = () => {
   const searchParams = useSearchParams()
   const id = searchParams.get("id")
   const [property, setProperty] = useState<PropertyDetail | null>(null)
   const [loading, setLoading] = useState(true)
   const [lightboxOpen, setLightboxOpen] = useState(false)
   const [lightboxIdx, setLightboxIdx] = useState(0)
   const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" })
   const [sent, setSent] = useState(false)

   // Imágenes computadas a nivel de componente para que useCallback tenga acceso
   const images = property?.media
      ? property.media.filter(m => m.mediaType === "image").sort((a, b) => a.sortOrder - b.sortOrder).map(m => m.url)
      : []

   useEffect(() => {
      if (!id) return
      fetch(`${API_BASE_URL}/properties/${id}`)
         .then(r => r.json())
         .then(data => setProperty(data?.property || data))
         .catch(() => setProperty(null))
         .finally(() => setLoading(false))
   }, [id])

   // Keyboard navigation para lightbox
   const handleKey = useCallback((e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowRight") setLightboxIdx(i => (i + 1) % images.length)
      if (e.key === "ArrowLeft") setLightboxIdx(i => (i - 1 + images.length) % images.length)
   }, [lightboxOpen, images.length])

   useEffect(() => {
      window.addEventListener("keydown", handleKey)
      return () => window.removeEventListener("keydown", handleKey)
   }, [handleKey])

   // Bloquear scroll cuando lightbox está abierto
   useEffect(() => {
      document.body.style.overflow = lightboxOpen ? "hidden" : ""
      return () => { document.body.style.overflow = "" }
   }, [lightboxOpen])

   const handleContact = (e: React.FormEvent) => {
      e.preventDefault()
      setSent(true)
      setContactForm({ name: "", email: "", phone: "", message: "" })
      setTimeout(() => setSent(false), 4000)
   }

   const formatPrice = (p: number, currency = "MXN") =>
      new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(p)

   const statusMap: Record<string, { label: string; color: string }> = {
      disponible: { label: "Disponible", color: "#22C55E" },
      vendida: { label: "Vendida", color: "#EF4444" },
      rentada: { label: "Rentada", color: "#F59E0B" },
      en_proceso: { label: "En Proceso", color: "#7B4FFF" },
      available: { label: "Disponible", color: "#22C55E" },
      sold: { label: "Vendida", color: "#EF4444" },
      rented: { label: "Rentada", color: "#F59E0B" },
   }

   if (loading) {
      return (
         <div style={{ minHeight: "100vh", background: "#0C0C0C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
               <div className="nubia-loader" />
               <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "24px", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Cargando propiedad
               </p>
            </div>
         </div>
      )
   }

   if (!property) {
      return (
         <div style={{ minHeight: "100vh", background: "#0C0C0C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
               <p style={{ color: "rgba(255,255,255,0.08)", fontSize: "120px", fontWeight: 900, lineHeight: 1, fontFamily: "Gordita, sans-serif" }}>404</p>
               <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", letterSpacing: "0.1em", marginBottom: "32px" }}>Propiedad no encontrada</p>
               <Link href="/" className="btn-nubia-primary">Volver al inicio</Link>
            </div>
         </div>
      )
   }

   const statusInfo = statusMap[property.status] || { label: property.status, color: "#7B4FFF" }
   const isVenta = property.transactionType === "venta"
   const videoInfo = property.videoUrl ? parseVideoUrl(property.videoUrl) : null
   const mapsEmbedUrl = property.googleMapsUrl ? toMapsEmbed(property.googleMapsUrl) : null

   const openLightbox = (idx: number) => {
      setLightboxIdx(idx)
      setLightboxOpen(true)
   }

   return (
      <div className="nubia-home nubia-pdp" style={{ background: "#0C0C0C", minHeight: "100vh" }}>

         {/* ───────────────────────────────────────────
             HERO — VIDEO DE FONDO / IMAGEN PRINCIPAL
         ─────────────────────────────────────────── */}
         <div style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden", background: "#0C0C0C" }}>

            {/* Video background */}
            {videoInfo && (videoInfo.type === "youtube" || videoInfo.type === "vimeo") && (
               <iframe
                  src={videoInfo.embedSrc}
                  title="Property Video"
                  allow="autoplay; fullscreen"
                  style={{
                     position: "absolute",
                     top: "50%", left: "50%",
                     width: "100vw",
                     height: "56.25vw",
                     minHeight: "100vh",
                     minWidth: "177.78vh",
                     transform: "translate(-50%,-50%)",
                     border: "none",
                     pointerEvents: "none",
                  }}
               />
            )}
            {videoInfo?.type === "direct" && (
               <video
                  autoPlay muted loop playsInline
                  src={videoInfo.embedSrc}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
               />
            )}

            {/* Fallback: primera imagen */}
            {!videoInfo && images.length > 0 && (
               <img
                  src={images[0]}
                  alt={property.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
               />
            )}

            {/* Gradient overlays */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,12,12,0.97) 0%, rgba(12,12,12,0.55) 45%, rgba(12,12,12,0.25) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,12,12,0.4) 0%, transparent 60%)" }} />

            {/* Header */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
               <HeaderTwo style_1={false} style_2={false} nubia={true} />
            </div>

            {/* Hero content */}
            <div style={{ position: "absolute", bottom: "96px", left: 0, right: 0, zIndex: 20 }}>
               <div className="container">
                  {/* Breadcrumb */}
                  <div className="d-flex align-items-center gap-2 mb-24" style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                     <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link>
                     <span>/</span>
                     <Link href="/listing-01" style={{ color: "inherit", textDecoration: "none" }}>Propiedades</Link>
                     <span>/</span>
                     <span style={{ color: "rgba(255,255,255,0.55)" }}>{property.title}</span>
                  </div>

                  {/* Badges */}
                  <div className="d-flex align-items-center gap-2 mb-20">
                     <span style={{ background: isVenta ? "#7B4FFF" : "transparent", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "2px", border: isVenta ? "none" : "1px solid rgba(255,255,255,0.25)" }}>
                        {isVenta ? "Venta" : "Renta"}
                     </span>
                     <span style={{ background: "transparent", color: statusInfo.color, fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "2px", border: `1px solid ${statusInfo.color}60` }}>
                        {statusInfo.label}
                     </span>
                     {property.featured && (
                        <span style={{ background: "rgba(123,79,255,0.15)", color: "#7B4FFF", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "2px", border: "1px solid rgba(123,79,255,0.3)" }}>
                           Destacada
                        </span>
                     )}
                  </div>

                  <div className="row align-items-end g-4">
                     <div className="col-lg-8">
                        <h1 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 5.5vw, 64px)", color: "#F5F5F2", letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: "20px" }}>
                           {property.title}
                        </h1>
                        <div className="d-flex align-items-center gap-2" style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px" }}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                           {[property.address, property.city, property.state].filter(Boolean).join(", ")}
                        </div>
                     </div>
                     <div className="col-lg-4 text-lg-end">
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px" }}>
                           Precio {isVenta ? "de venta" : "mensual"}
                        </div>
                        <div style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4.5vw, 52px)", color: "#7B4FFF", letterSpacing: "-0.02em", lineHeight: 1 }}>
                           {property.discountPrice && property.discountPrice > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                 <span style={{ fontSize: "0.45em", color: "rgba(255,255,255,0.35)", textDecoration: "line-through", marginBottom: "2px" }}>
                                    {formatPrice(property.price, property.currency)}
                                 </span>
                                 <span>{formatPrice(property.discountPrice, property.currency)}</span>
                              </div>
                           ) : formatPrice(property.price, property.currency)}
                        </div>
                        {!isVenta && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "4px" }}>/mes</div>}
                     </div>
                  </div>
               </div>
            </div>

            {/* Scroll indicator */}
            <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
               <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))" }} />
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
         </div>

         {/* ───────────────────────────────────────────
             GALERÍA DE FOTOS
         ─────────────────────────────────────────── */}
         {images.length > 0 && (
            <div style={{ padding: "64px 0 0" }}>
               <div className="container">
                  <div className="d-flex align-items-center justify-content-between mb-24">
                     <h2 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", margin: 0 }}>
                        Galería
                     </h2>
                     {images.length > 5 && (
                        <button
                           onClick={() => openLightbox(0)}
                           style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "2px", padding: "8px 18px", color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#7B4FFF"; (e.currentTarget as HTMLElement).style.color = "#7B4FFF" }}
                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)" }}
                        >
                           Ver todas ({images.length})
                        </button>
                     )}
                  </div>

                  {/* Grid tipo Airbnb */}
                  {images.length === 1 && (
                     <div style={{ borderRadius: "4px", overflow: "hidden", aspectRatio: "16/9", maxHeight: "560px", cursor: "pointer" }} onClick={() => openLightbox(0)}>
                        <img src={images[0]} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                     </div>
                  )}

                  {images.length >= 2 && images.length <= 3 && (
                     <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "8px", borderRadius: "4px", overflow: "hidden" }}>
                        {images.slice(0, 3).map((img, i) => (
                           <div key={i} onClick={() => openLightbox(i)} style={{ aspectRatio: i === 0 ? "4/3" : "4/3", overflow: "hidden", cursor: "pointer", gridRow: i === 0 ? "1 / 3" : "auto", position: "relative" }}>
                              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                                 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)" }}
                                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                              />
                           </div>
                        ))}
                     </div>
                  )}

                  {images.length >= 4 && (
                     <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gridTemplateRows: "1fr 1fr", gap: "8px", height: "560px", borderRadius: "4px", overflow: "hidden" }}>
                        {/* Imagen principal */}
                        <div onClick={() => openLightbox(0)} style={{ gridRow: "1 / 3", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                           <img src={images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)" }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                           />
                        </div>
                        {/* 2x2 grid derecho */}
                        {images.slice(1, 5).map((img, i) => (
                           <div key={i} onClick={() => openLightbox(i + 1)} style={{ overflow: "hidden", cursor: "pointer", position: "relative" }}>
                              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                                 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.06)" }}
                                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                              />
                              {/* Overlay "ver más" en la última imagen si hay más de 5 */}
                              {i === 3 && images.length > 5 && (
                                 <div style={{ position: "absolute", inset: 0, background: "rgba(12,12,12,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" style={{ marginBottom: "8px" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                    <span style={{ color: "#fff", fontFamily: "Gordita, sans-serif", fontWeight: 700, fontSize: "18px" }}>+{images.length - 5}</span>
                                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2px" }}>más fotos</span>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* ───────────────────────────────────────────
             SPECS BAR
         ─────────────────────────────────────────── */}
         <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#111111", marginTop: "48px" }}>
            <div className="container">
               <div className="row g-0">
                  {[
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Tipo", value: property.propertyType },
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M2 4v16M22 4v16M2 12h20M12 4v16"/></svg>, label: "Recámaras", value: property.bedrooms != null ? String(property.bedrooms) : "—" },
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M4 12h16M4 6h16M4 18h7"/></svg>, label: "Baños", value: property.bathrooms || "—" },
                     { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><path d="M21 3H3v18h18V3z"/><path d="M3 9h18M9 21V9"/></svg>, label: "Superficie", value: property.totalArea ? `${property.totalArea} m²` : "—" },
                     ...(property.parkingSpaces ? [{ icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="1.5"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 6V4M16 6V4"/></svg>, label: "Estacionamientos", value: String(property.parkingSpaces) }] : []),
                  ].map((spec, i, arr) => (
                     <div key={i} className="col-6 col-md" style={{ padding: "28px 24px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                        <div className="d-flex align-items-center gap-3">
                           {spec.icon}
                           <div>
                              <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>{spec.label}</div>
                              <div style={{ fontSize: "18px", fontWeight: 700, color: "#F5F5F2", fontFamily: "Gordita, sans-serif", textTransform: "capitalize" }}>{spec.value}</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* ───────────────────────────────────────────
             CONTENIDO PRINCIPAL + SIDEBAR
         ─────────────────────────────────────────── */}
         <div style={{ padding: "64px 0 120px" }}>
            <div className="container">
               <div className="row g-5">

                  {/* ── COLUMNA IZQUIERDA ── */}
                  <div className="col-xl-8">

                     {/* Descripción */}
                     <div style={{ background: "#111111", borderRadius: "4px", padding: "40px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: "20px" }}>
                           Descripción
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap" }}>
                           {property.description || `Esta propiedad en ${property.address} ofrece una excelente oportunidad en el mercado inmobiliario. Con ${property.totalArea} m² de superficie${property.bedrooms ? `, ${property.bedrooms} recámaras` : ""}${property.bathrooms ? ` y ${property.bathrooms} baños` : ""}, está pensada para quienes buscan comodidad y calidad de vida. Contáctanos para más información o para agendar una visita.`}
                        </p>
                     </div>

                     {/* Detalles */}
                     <div style={{ background: "#111111", borderRadius: "4px", padding: "40px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: "28px" }}>
                           Detalles de la propiedad
                        </h3>
                        <div className="row g-3">
                           {[
                              { label: "Tipo de propiedad", value: property.propertyType },
                              { label: "Transacción", value: isVenta ? "Venta" : "Renta" },
                              ...(property.bedrooms != null ? [{ label: "Recámaras", value: property.bedrooms }] : []),
                              ...(property.bathrooms ? [{ label: "Baños", value: property.bathrooms }] : []),
                              ...(property.totalArea ? [{ label: "Superficie total", value: `${property.totalArea} m²` }] : []),
                              ...(property.builtArea ? [{ label: "Superficie construida", value: `${property.builtArea} m²` }] : []),
                              ...(property.parkingSpaces ? [{ label: "Estacionamientos", value: property.parkingSpaces }] : []),
                              ...(property.yearBuilt ? [{ label: "Año de construcción", value: property.yearBuilt }] : []),
                              { label: "Estado", value: statusInfo.label },
                              ...(property.currency && property.currency !== "MXN" ? [{ label: "Moneda", value: property.currency }] : []),
                           ].map((d, i) => (
                              <div key={i} className="col-6 col-md-4">
                                 <div style={{ padding: "16px", background: "#0C0C0C", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>{d.label}</div>
                                    <div style={{ fontSize: "15px", fontWeight: 600, color: "#F5F5F2", textTransform: "capitalize" }}>{String(d.value)}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Ubicación */}
                     <div style={{ background: "#111111", borderRadius: "4px", padding: "40px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <h3 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "22px", color: "#F5F5F2", letterSpacing: "-0.02em", marginBottom: "16px" }}>
                           Ubicación
                        </h3>
                        <div className="d-flex align-items-center gap-2 mb-24" style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                           {[property.address, property.city, property.state].filter(Boolean).join(", ")}
                        </div>

                        {mapsEmbedUrl ? (
                           <div style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <iframe
                                 src={mapsEmbedUrl}
                                 width="100%"
                                 height="320"
                                 style={{ border: 0, display: "block", filter: "grayscale(1) invert(0.92) contrast(0.85)" }}
                                 allowFullScreen
                                 loading="lazy"
                                 referrerPolicy="no-referrer-when-downgrade"
                                 title="Ubicación de la propiedad"
                              />
                           </div>
                        ) : (
                           <div style={{ background: "#0C0C0C", borderRadius: "2px", height: "240px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <div style={{ textAlign: "center" }}>
                                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(123,79,255,0.3)" strokeWidth="1.5" style={{ display: "block", margin: "0 auto 12px" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                 <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>Mapa no disponible</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* ── SIDEBAR ── */}
                  <div className="col-xl-4">
                     <div style={{ position: "sticky", top: "100px" }}>

                        {/* Precio */}
                        <div style={{ background: "#111111", borderRadius: "4px", padding: "32px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                           <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
                              Precio {isVenta ? "de venta" : "mensual"}
                           </div>
                           <div style={{ fontFamily: "Gordita, sans-serif", fontWeight: 900, fontSize: "36px", color: "#7B4FFF", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "24px" }}>
                              {property.discountPrice && property.discountPrice > 0 ? (
                                 <div>
                                    <div style={{ fontSize: "0.45em", color: "rgba(255,255,255,0.35)", textDecoration: "line-through", marginBottom: "4px" }}>
                                       {formatPrice(property.price, property.currency)}
                                    </div>
                                    <div>{formatPrice(property.discountPrice, property.currency)}</div>
                                 </div>
                              ) : formatPrice(property.price, property.currency)}
                           </div>
                           {!isVenta && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "-18px", marginBottom: "24px" }}>/mes</div>}
                           <div className="d-flex gap-2">
                              <button className="btn-nubia-primary flex-fill" style={{ textAlign: "center" }}>
                                 Agendar visita
                              </button>
                              <button
                                 className="btn-nubia-heart"
                                 title="Guardar"
                              >
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                              </button>
                           </div>
                        </div>

                        {/* Formulario de contacto */}
                        <div style={{ background: "#111111", borderRadius: "4px", padding: "32px", border: "1px solid rgba(255,255,255,0.06)" }}>
                           <h5 style={{ fontFamily: "Gordita, sans-serif", fontWeight: 700, fontSize: "14px", color: "#F5F5F2", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px" }}>
                              Solicitar información
                           </h5>

                           {sent ? (
                              <div style={{ textAlign: "center", padding: "32px 0" }}>
                                 <div style={{ width: "48px", height: "48px", background: "rgba(123,79,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B4FFF" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                 </div>
                                 <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", margin: 0 }}>Mensaje enviado.<br />Te contactaremos pronto.</p>
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
                                       className="nubia-pdp-input"
                                    />
                                 ))}
                                 <textarea
                                    placeholder="¿Qué te interesa saber sobre esta propiedad?"
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                                    required
                                    className="nubia-pdp-input"
                                    style={{ resize: "vertical", fontFamily: "inherit" }}
                                 />
                                 <button type="submit" className="btn-nubia-primary w-100" style={{ textAlign: "center" }}>
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

         {/* ───────────────────────────────────────────
             LIGHTBOX
         ─────────────────────────────────────────── */}
         {lightboxOpen && images.length > 0 && (
            <div
               onClick={() => setLightboxOpen(false)}
               style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
               {/* Imagen */}
               <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                     src={images[lightboxIdx]}
                     alt=""
                     style={{ maxWidth: "90vw", maxHeight: "88vh", objectFit: "contain", borderRadius: "2px", display: "block" }}
                  />
               </div>

               {/* Cerrar */}
               <button
                  onClick={() => setLightboxOpen(false)}
                  style={{ position: "fixed", top: "24px", right: "24px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
               >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
               </button>

               {/* Anterior */}
               {images.length > 1 && (
                  <button
                     onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + images.length) % images.length) }}
                     style={{ position: "fixed", left: "24px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
                  >
                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
               )}

               {/* Siguiente */}
               {images.length > 1 && (
                  <button
                     onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % images.length) }}
                     style={{ position: "fixed", right: "24px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
                  >
                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
               )}

               {/* Contador + thumbnails */}
               <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }} onClick={e => e.stopPropagation()}>
                  <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>
                     {lightboxIdx + 1} / {images.length}
                  </div>
                  <div className="d-flex gap-2" style={{ maxWidth: "80vw", overflowX: "auto", scrollbarWidth: "none", padding: "4px 0" }}>
                     {images.map((img, i) => (
                        <button
                           key={i}
                           onClick={() => setLightboxIdx(i)}
                           style={{ flexShrink: 0, width: "56px", height: "40px", borderRadius: "2px", overflow: "hidden", border: `2px solid ${lightboxIdx === i ? "#7B4FFF" : "transparent"}`, padding: 0, cursor: "pointer", opacity: lightboxIdx === i ? 1 : 0.45, transition: "all 0.2s" }}
                        >
                           <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         )}

         <style>{`
            .nubia-pdp .btn-nubia-primary {
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
            .nubia-pdp .btn-nubia-primary:hover { background: #9D7AFF; color: #fff; }
            .nubia-pdp .btn-nubia-heart {
               width: 46px;
               height: 46px;
               flex-shrink: 0;
               background: transparent;
               border: 1px solid rgba(255,255,255,0.12);
               border-radius: 2px;
               display: flex;
               align-items: center;
               justify-content: center;
               cursor: pointer;
               color: rgba(255,255,255,0.4);
               transition: all 0.2s;
            }
            .nubia-pdp .btn-nubia-heart:hover { border-color: #7B4FFF; color: #7B4FFF; }
            .nubia-pdp .nubia-pdp-input {
               width: 100%;
               background: #0C0C0C;
               border: 1px solid rgba(255,255,255,0.08);
               border-radius: 2px;
               padding: 12px 16px;
               color: #F5F5F2;
               font-size: 14px;
               margin-bottom: 10px;
               outline: none;
               display: block;
               transition: border-color 0.2s;
            }
            .nubia-pdp .nubia-pdp-input::placeholder { color: rgba(255,255,255,0.2); }
            .nubia-pdp .nubia-pdp-input:focus { border-color: rgba(123,79,255,0.5); }
            .nubia-loader {
               width: 32px;
               height: 32px;
               border: 2px solid rgba(123,79,255,0.15);
               border-top-color: #7B4FFF;
               border-radius: 50%;
               animation: spin 0.8s linear infinite;
               margin: 0 auto;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
         `}</style>
      </div>
   )
}

export default NubiaPropertyDetail
