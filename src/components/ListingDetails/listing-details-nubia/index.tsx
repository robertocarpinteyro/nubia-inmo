"use client"
import { useEffect, useState } from "react"
import MediaGallery from "@/components/ListingDetails/listing-details-6/MediaGallery"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { API_BASE_URL } from "@/context/AuthContext"
import HeaderTwo from "@/layouts/headers/HeaderTwo"
import NubiaFooter from "@/components/homes/home-two/NubiaFooter"
import BeforeAfterSlider from "@/components/common/BeforeAfterSlider"

// ── Nubia design tokens ────────────────────────────────────────
const N = {
   paper:    "#f0ebe3",
   paper2:   "#e6e0d4",
   ink:      "#1a1612",
   ink2:     "#2c2620",
   inkSoft:  "#6b6258",
   terra:    "#b85c3c",
   terraDeep:"#8e3f24",
   ocre:     "#c89968",
   salvia:   "#8a8779",
   line:     "rgba(26,22,18,0.18)",
   lineSoft: "rgba(26,22,18,0.10)",
}

const F = {
   display: "'Fraunces', Georgia, serif",
   sans:    "'Geist', system-ui, sans-serif",
   mono:    "'JetBrains Mono', ui-monospace, monospace",
}

// ── Interfaces ────────────────────────────────────────────────
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

// ── Video helpers ─────────────────────────────────────────────
function parseVideoUrl(url: string): { type: "youtube" | "vimeo" | "direct"; embedSrc: string } | null {
   if (!url) return null
   const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/)
   if (yt) {
      const id = yt[1]
      return { type: "youtube", embedSrc: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3` }
   }
   const vm = url.match(/vimeo\.com\/(\d+)/)
   if (vm) return { type: "vimeo", embedSrc: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&muted=1&loop=1&background=1` }
   return { type: "direct", embedSrc: url }
}

function parseVideoUrlPlayer(url: string): { type: "youtube" | "vimeo" | "direct"; embedSrc: string } | null {
   if (!url) return null
   const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/)
   if (yt) {
      const id = yt[1]
      return { type: "youtube", embedSrc: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` }
   }
   const vm = url.match(/vimeo\.com\/(\d+)/)
   if (vm) return { type: "vimeo", embedSrc: `https://player.vimeo.com/video/${vm[1]}?title=0&byline=0&portrait=0` }
   return { type: "direct", embedSrc: url }
}

function toMapsEmbed(url: string): string {
   if (!url) return ""
   if (url.includes("/embed")) return url
   const qMatch = url.match(/[?&]q=([^&]+)/)
   if (qMatch) return `https://maps.google.com/maps?q=${qMatch[1]}&z=15&output=embed`
   return url
}

// ── Component ─────────────────────────────────────────────────
const NubiaPropertyDetail = () => {
   const searchParams = useSearchParams()
   const id = searchParams.get("id")
   const [property, setProperty] = useState<PropertyDetail | null>(null)
   const [loading, setLoading] = useState(true)
   const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" })
   const [sent, setSent] = useState(false)

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

   const handleContact = (e: React.FormEvent) => {
      e.preventDefault()
      setSent(true)
      setContactForm({ name: "", email: "", phone: "", message: "" })
      setTimeout(() => setSent(false), 4000)
   }

   const formatPrice = (p: number, currency = "MXN") =>
      new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(p)

   const statusMap: Record<string, { label: string; color: string; border: string }> = {
      disponible:  { label: "En venta",    color: N.terra,   border: N.terra },
      available:   { label: "En venta",    color: N.terra,   border: N.terra },
      vendida:     { label: "Vendida",     color: N.inkSoft, border: N.line },
      sold:        { label: "Vendida",     color: N.inkSoft, border: N.line },
      rentada:     { label: "Rentada",     color: N.ocre,    border: N.ocre },
      rented:      { label: "Rentada",     color: N.ocre,    border: N.ocre },
      en_proceso:  { label: "En proceso",  color: N.salvia,  border: N.salvia },
   }

   // ── Loading ──────────────────────────────────────────────
   if (loading) {
      return (
         <div style={{ minHeight: "100vh", background: N.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
               <div className="nb-loader" />
               <p style={{ fontFamily: F.mono, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: N.inkSoft, marginTop: "24px" }}>
                  Cargando
               </p>
            </div>
         </div>
      )
   }

   // ── Not found ────────────────────────────────────────────
   if (!property) {
      return (
         <div style={{ minHeight: "100vh", background: N.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
               <div style={{ fontFamily: F.display, fontSize: "120px", fontWeight: 300, lineHeight: 1, color: N.lineSoft }}>404</div>
               <p style={{ fontFamily: F.sans, fontSize: "14px", color: N.inkSoft, letterSpacing: "0.04em", marginBottom: "32px" }}>Propiedad no encontrada</p>
               <Link href="/" style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: N.terra, textDecoration: "none", borderBottom: `1px solid ${N.terra}` }}>
                  Volver al inicio →
               </Link>
            </div>
         </div>
      )
   }

   const statusInfo = statusMap[property.status] || { label: property.status, color: N.inkSoft, border: N.line }
   const isVenta = property.transactionType === "venta"
   const videoInfo = property.videoUrl ? parseVideoUrl(property.videoUrl) : null
   const videoPlayerInfo = property.videoUrl ? parseVideoUrlPlayer(property.videoUrl) : null
   const mapsEmbedUrl = property.googleMapsUrl ? toMapsEmbed(property.googleMapsUrl) : null
   const isLote = property.propertyType === "lote"
   const beforeImg = property.media?.find(m => m.mediaType === "image")?.url || null
   const afterImg  = property.media?.find(m => m.mediaType === "render")?.url || null

   // ── Specs data ───────────────────────────────────────────
   const specs = [
      { value: property.propertyType,                                        label: "Tipo" },
      { value: property.bedrooms != null ? String(property.bedrooms) : null, label: "Recámaras" },
      { value: property.bathrooms || null,                                   label: "Baños" },
      { value: property.totalArea ? `${property.totalArea}` : null,          label: "M² totales" },
      { value: property.builtArea ? `${property.builtArea}` : null,          label: "M² construidos" },
      { value: property.parkingSpaces ? String(property.parkingSpaces) : null, label: "Estacionam." },
      { value: property.yearBuilt ? String(property.yearBuilt) : null,       label: "Año" },
   ].filter(s => s.value !== null) as { value: string; label: string }[]

   return (
      <div className="nb-pdp" style={{ background: N.paper, minHeight: "100vh" }}>

         {/* ══════════════════════════════════════════════════
             HERO — video / imagen full-screen
         ══════════════════════════════════════════════════ */}
         <div style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden", background: N.ink2 }}>

            {/* Video o imagen de fondo */}
            {videoInfo && (videoInfo.type === "youtube" || videoInfo.type === "vimeo") && (
               <iframe src={videoInfo.embedSrc} title="Property Video" allow="autoplay; fullscreen"
                  style={{ position: "absolute", top: "50%", left: "50%", width: "100vw", height: "56.25vw", minHeight: "100vh", minWidth: "177.78vh", transform: "translate(-50%,-50%)", border: "none", pointerEvents: "none" }} />
            )}
            {videoInfo?.type === "direct" && (
               <video autoPlay muted loop playsInline src={videoInfo.embedSrc}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            {!videoInfo && images.length > 0 && (
               <img src={images[0]} alt={property.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}

            {/* Overlays */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,22,18,0.94) 0%, rgba(26,22,18,0.45) 50%, rgba(26,22,18,0.20) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,22,18,0.35) 0%, transparent 60%)" }} />

            {/* Header */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
               <HeaderTwo style_1={false} style_2={false} nubia={true} />
            </div>

            {/* Hero content — bottom */}
            <div style={{ position: "absolute", bottom: "96px", left: 0, right: 0, zIndex: 20 }}>
               <div className="container">

                  {/* Breadcrumb */}
                  <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,235,227,0.45)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                     <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link>
                     <span>·</span>
                     <Link href="/listing_07" style={{ color: "inherit", textDecoration: "none" }}>Propiedades</Link>
                     <span>·</span>
                     <span style={{ color: N.ocre }}>{[property.city, property.state].filter(Boolean).join(", ") || "Querétaro"}</span>
                  </div>

                  {/* Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                     <span style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.ocre }}>
                        {isVenta ? "En venta" : "En renta"}
                     </span>
                     <span style={{ color: "rgba(240,235,227,0.25)", fontSize: "10px" }}>·</span>
                     <span style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: statusInfo.color }}>
                        {statusInfo.label}
                     </span>
                     {property.featured && (
                        <>
                           <span style={{ color: "rgba(240,235,227,0.25)", fontSize: "10px" }}>·</span>
                           <span style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.terra }}>Destacada</span>
                        </>
                     )}
                  </div>

                  <div className="row align-items-end g-4">
                     <div className="col-lg-8">
                        <h1 style={{ fontFamily: F.display, fontWeight: 300, fontSize: "clamp(2.4rem, 6vw, 72px)", color: N.paper, letterSpacing: "-0.02em", lineHeight: 0.97, marginBottom: "18px" }}>
                           {property.title}
                        </h1>
                        <div style={{ fontFamily: F.sans, fontSize: "14px", color: "rgba(240,235,227,0.55)", display: "flex", alignItems: "center", gap: "8px" }}>
                           <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4-5-7-8-7-12a7 7 0 0114 0c0 4-3 7-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
                           {[property.address, property.city, property.state].filter(Boolean).join(", ")}
                        </div>
                     </div>
                     <div className="col-lg-4 text-lg-end">
                        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,235,227,0.35)", marginBottom: "6px" }}>
                           Precio {isVenta ? "de venta" : "mensual"}
                        </div>
                        {property.discountPrice && property.discountPrice > 0 ? (
                           <div>
                              <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "clamp(1rem, 2vw, 20px)", color: "rgba(240,235,227,0.35)", textDecoration: "line-through", fontStyle: "italic", marginBottom: "4px" }}>
                                 {formatPrice(property.price, property.currency)}
                              </div>
                              <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 52px)", color: N.ocre, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1 }}>
                                 {formatPrice(property.discountPrice, property.currency)}
                              </div>
                           </div>
                        ) : (
                           <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 52px)", color: N.ocre, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1 }}>
                              {formatPrice(property.price, property.currency)}
                           </div>
                        )}
                        {!isVenta && <div style={{ fontFamily: F.mono, fontSize: "10px", letterSpacing: "0.14em", color: "rgba(240,235,227,0.35)", marginTop: "4px" }}>/mes</div>}
                     </div>
                  </div>
               </div>
            </div>

            {/* Scroll cue */}
            <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
               <div style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, transparent, rgba(240,235,227,0.25))` }} />
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(240,235,227,0.3)" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
         </div>

         {/* ══════════════════════════════════════════════════
             GALERÍA
         ══════════════════════════════════════════════════ */}
         {images.length > 0 && (
            <div style={{ background: N.paper, padding: "56px 0 0" }}>
               <div className="container">
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `1px solid ${N.line}`, paddingBottom: "14px", marginBottom: "24px" }}>
                     <div>
                        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.terra, marginBottom: "4px" }}>
                           Fotografías
                        </div>
                        <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "28px", color: N.ink, lineHeight: 1 }}>
                           Galería
                        </div>
                     </div>
                     <span style={{ fontFamily: F.mono, fontSize: "10px", letterSpacing: "0.16em", color: N.inkSoft }}>
                        {images.length} {images.length === 1 ? "imagen" : "imágenes"}
                     </span>
                  </div>
                  <MediaGallery media={property.media || []} />
               </div>
            </div>
         )}

         {/* ══════════════════════════════════════════════════
             ANTES / DESPUÉS — lotes
         ══════════════════════════════════════════════════ */}
         {isLote && beforeImg && afterImg && (
            <div style={{ padding: "56px 0 0" }}>
               <div className="container">
                  <div style={{ display: "flex", alignItems: "baseline", gap: "16px", borderBottom: `1px solid ${N.line}`, paddingBottom: "14px", marginBottom: "24px" }}>
                     <div>
                        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.terra, marginBottom: "4px" }}>Proyección</div>
                        <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "28px", color: N.ink, lineHeight: 1 }}>Estado actual vs. Render</div>
                     </div>
                  </div>
                  <div style={{ border: `1px solid ${N.line}`, overflow: "hidden" }}>
                     <BeforeAfterSlider before={beforeImg} after={afterImg} />
                  </div>
               </div>
            </div>
         )}

         {/* ══════════════════════════════════════════════════
             VIDEO
         ══════════════════════════════════════════════════ */}
         {videoPlayerInfo && (
            <div style={{ padding: "56px 0 0" }}>
               <div className="container">
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `1px solid ${N.line}`, paddingBottom: "14px", marginBottom: "24px" }}>
                     <div>
                        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.terra, marginBottom: "4px" }}>Recorrido virtual</div>
                        <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "28px", color: N.ink, lineHeight: 1 }}>Video</div>
                     </div>
                  </div>
                  <div style={{ position: "relative", border: `1px solid ${N.line}`, overflow: "hidden", aspectRatio: "16/9", background: N.ink }}>
                     {videoPlayerInfo.type !== "direct" ? (
                        <iframe src={videoPlayerInfo.embedSrc} title="Video de la propiedad"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                           allowFullScreen
                           style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
                     ) : (
                        <video controls src={videoPlayerInfo.embedSrc}
                           style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: N.ink }} />
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* ══════════════════════════════════════════════════
             SPECS BAR
         ══════════════════════════════════════════════════ */}
         {specs.length > 0 && (
            <div style={{ borderTop: `1px solid ${N.line}`, borderBottom: `1px solid ${N.line}`, background: N.paper2, marginTop: "56px" }}>
               <div className="container">
                  <div className="row g-0">
                     {specs.map((spec, i) => (
                        <div key={i} className="col-6 col-sm-4 col-md"
                           style={{ padding: "28px 24px", borderRight: i < specs.length - 1 ? `1px solid ${N.line}` : "none" }}>
                           <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "36px", color: N.ink, lineHeight: 1, textTransform: "capitalize", letterSpacing: "-0.01em" }}>
                              {spec.value}
                           </div>
                           <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: N.inkSoft, marginTop: "6px" }}>
                              {spec.label}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* ══════════════════════════════════════════════════
             CONTENIDO + SIDEBAR
         ══════════════════════════════════════════════════ */}
         <div style={{ padding: "64px 0 120px" }}>
            <div className="container">
               <div className="row g-5">

                  {/* ── Columna principal ── */}
                  <div className="col-xl-8">

                     {/* Descripción */}
                     <section style={{ paddingBottom: "48px", borderBottom: `1px solid ${N.line}`, marginBottom: "48px" }}>
                        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.terra, marginBottom: "10px" }}>
                           Sobre la propiedad
                        </div>
                        <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "28px", color: N.ink, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "24px" }}>
                           Descripción
                        </div>
                        {/* Pull quote serif-italic */}
                        {property.description && property.description.length > 80 && (
                           <div style={{ fontFamily: F.display, fontStyle: "italic", fontWeight: 300, fontSize: "22px", lineHeight: 1.4, color: N.ink, marginBottom: "20px", paddingLeft: "20px", borderLeft: `2px solid ${N.terra}` }}>
                              {property.description.slice(0, 120)}{property.description.length > 120 ? "…" : ""}
                           </div>
                        )}
                        <p style={{ fontFamily: F.sans, fontWeight: 300, fontSize: "15px", lineHeight: 1.75, color: N.inkSoft, margin: 0, whiteSpace: "pre-wrap" }}>
                           {property.description || `Esta propiedad en ${property.address} ofrece una excelente oportunidad en el mercado inmobiliario. Con ${property.totalArea} m² de superficie${property.bedrooms ? `, ${property.bedrooms} recámaras` : ""}${property.bathrooms ? ` y ${property.bathrooms} baños` : ""}, está pensada para quienes buscan comodidad y calidad de vida.`}
                        </p>
                     </section>

                     {/* Detalles de la propiedad */}
                     <section style={{ paddingBottom: "48px", borderBottom: `1px solid ${N.line}`, marginBottom: "48px" }}>
                        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.terra, marginBottom: "10px" }}>
                           Ficha técnica
                        </div>
                        <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "28px", color: N.ink, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "28px" }}>
                           Detalles
                        </div>
                        <div className="row g-0">
                           {[
                              { label: "Tipo de propiedad", value: property.propertyType },
                              { label: "Operación",         value: isVenta ? "Venta" : "Renta" },
                              ...(property.bedrooms != null ? [{ label: "Recámaras", value: String(property.bedrooms) }] : []),
                              ...(property.bathrooms ? [{ label: "Baños", value: property.bathrooms }] : []),
                              ...(property.totalArea ? [{ label: "Superficie total", value: `${property.totalArea} m²` }] : []),
                              ...(property.builtArea ? [{ label: "Sup. construida", value: `${property.builtArea} m²` }] : []),
                              ...(property.parkingSpaces ? [{ label: "Estacionamientos", value: String(property.parkingSpaces) }] : []),
                              ...(property.yearBuilt ? [{ label: "Año", value: String(property.yearBuilt) }] : []),
                              { label: "Estado", value: statusInfo.label },
                              ...(property.currency && property.currency !== "MXN" ? [{ label: "Moneda", value: property.currency }] : []),
                           ].map((d, i, arr) => (
                              <div key={i} className="col-6 col-md-4"
                                 style={{ padding: "16px 0", borderBottom: `1px dotted ${N.lineSoft}` }}>
                                 <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: N.inkSoft, marginBottom: "6px" }}>
                                    {d.label}
                                 </div>
                                 <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "20px", color: N.ink, textTransform: "capitalize" }}>
                                    {d.value}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* Ubicación */}
                     <section>
                        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.terra, marginBottom: "10px" }}>
                           Localización
                        </div>
                        <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "28px", color: N.ink, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "8px" }}>
                           Ubicación
                        </div>
                        <div style={{ fontFamily: F.sans, fontSize: "13px", color: N.inkSoft, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                           <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4-5-7-8-7-12a7 7 0 0114 0c0 4-3 7-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
                           {[property.address, property.city, property.state].filter(Boolean).join(", ")}
                        </div>

                        {mapsEmbedUrl ? (
                           <div style={{ border: `1px solid ${N.line}`, overflow: "hidden" }}>
                              <iframe src={mapsEmbedUrl} width="100%" height="300"
                                 style={{ border: 0, display: "block", filter: "sepia(0.35) contrast(0.9) saturate(0.7)" }}
                                 allowFullScreen loading="lazy"
                                 referrerPolicy="no-referrer-when-downgrade"
                                 title="Ubicación de la propiedad" />
                           </div>
                        ) : (
                           <div style={{ border: `1px solid ${N.line}`, height: "220px", display: "flex", alignItems: "center", justifyContent: "center", background: N.paper2 }}>
                              <div style={{ textAlign: "center" }}>
                                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={N.salvia} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 10px" }}><path d="M12 21c-4-5-7-8-7-12a7 7 0 0114 0c0 4-3 7-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
                                 <p style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: N.salvia, margin: 0 }}>Mapa no disponible</p>
                              </div>
                           </div>
                        )}
                     </section>

                  </div>

                  {/* ── Sidebar ── */}
                  <div className="col-xl-4">
                     <div style={{ position: "sticky", top: "100px" }}>

                        {/* Precio + CTA — bloque oscuro */}
                        <div style={{ background: N.ink, color: N.paper, padding: "32px", marginBottom: "12px" }}>
                           <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: N.ocre, marginBottom: "8px" }}>
                              Precio {isVenta ? "de venta" : "mensual"}
                           </div>
                           {property.discountPrice && property.discountPrice > 0 ? (
                              <div>
                                 <div style={{ fontFamily: F.display, fontWeight: 300, fontStyle: "italic", fontSize: "16px", color: "rgba(240,235,227,0.35)", textDecoration: "line-through", marginBottom: "4px" }}>
                                    {formatPrice(property.price, property.currency)}
                                 </div>
                                 <div style={{ fontFamily: F.display, fontWeight: 300, fontStyle: "italic", fontSize: "44px", color: N.ocre, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "4px" }}>
                                    {formatPrice(property.discountPrice, property.currency)}
                                 </div>
                              </div>
                           ) : (
                              <div style={{ fontFamily: F.display, fontWeight: 300, fontStyle: "italic", fontSize: "44px", color: N.ocre, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "4px" }}>
                                 {formatPrice(property.price, property.currency)}
                              </div>
                           )}
                           {!isVenta && (
                              <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.16em", color: "rgba(240,235,227,0.45)", marginBottom: "24px" }}>/mes</div>
                           )}

                           {/* Formulario de contacto — bloque terracota */}
                           <div style={{ background: N.terra, padding: "24px", marginTop: "24px" }}>
                              <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: "20px", color: N.paper, marginBottom: "18px", lineHeight: 1 }}>
                                 Solicitar visita
                              </div>
                              {sent ? (
                                 <div style={{ textAlign: "center", padding: "20px 0" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={N.paper} strokeWidth="1.5" strokeLinecap="round" style={{ display: "block", margin: "0 auto 12px" }}><polyline points="20 6 9 17 4 12"/></svg>
                                    <p style={{ fontFamily: F.sans, fontSize: "13px", color: N.paper, opacity: 0.85, margin: 0 }}>Mensaje enviado.<br />Te contactaremos pronto.</p>
                                 </div>
                              ) : (
                                 <form onSubmit={handleContact}>
                                    {[
                                       { placeholder: "Tu nombre", key: "name",  type: "text" },
                                       { placeholder: "Correo o WhatsApp", key: "email", type: "email" },
                                       { placeholder: "Teléfono (opcional)", key: "phone", type: "tel" },
                                    ].map(({ placeholder, key, type }) => (
                                       <input key={key} type={type} placeholder={placeholder}
                                          value={contactForm[key as keyof typeof contactForm]}
                                          onChange={e => setContactForm(f => ({ ...f, [key]: e.target.value }))}
                                          required={key !== "phone"}
                                          className="nb-form-input"
                                       />
                                    ))}
                                    <textarea placeholder="¿Qué te interesa saber de esta propiedad?" rows={3}
                                       value={contactForm.message}
                                       onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                                       required className="nb-form-input"
                                       style={{ resize: "vertical", fontFamily: "inherit" }}
                                    />
                                    <button type="submit" className="nb-form-btn">
                                       Agendar <span style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "0.16em" }}>→</span>
                                    </button>
                                 </form>
                              )}
                           </div>

                           {/* Datos de contacto */}
                           <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(240,235,227,0.12)" }}>
                              <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,235,227,0.45)", marginBottom: "10px" }}>
                                 Nubia Inmobiliaria
                              </div>
                              <div style={{ fontFamily: F.sans, fontSize: "13px", color: "rgba(240,235,227,0.7)", lineHeight: 1.6 }}>
                                 Av. Constituyentes 218<br />
                                 Querétaro, Qro. · 442 318 04 22
                              </div>
                           </div>
                        </div>

                        {/* Accesos rápidos */}
                        <div style={{ display: "flex", gap: "8px" }}>
                           <button className="nb-action-btn" style={{ flex: 1 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                              Guardar
                           </button>
                           <button className="nb-action-btn" style={{ flex: 1 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                              Compartir
                           </button>
                        </div>

                     </div>
                  </div>

               </div>
            </div>
         </div>

         <NubiaFooter />

         {/* ── Estilos locales ──────────────────────────────── */}
         <style>{`
            .nb-pdp * { box-sizing: border-box; }

            .nb-loader {
               width: 24px;
               height: 24px;
               border: 1.5px solid rgba(26,22,18,0.12);
               border-top-color: ${N.terra};
               border-radius: 50%;
               animation: nb-spin 0.9s linear infinite;
               margin: 0 auto;
            }
            @keyframes nb-spin { to { transform: rotate(360deg); } }

            .nb-form-input {
               width: 100%;
               background: rgba(240,235,227,0.15);
               border: none;
               border-bottom: 1px solid rgba(240,235,227,0.3);
               padding: 10px 0;
               color: #f0ebe3;
               font-family: 'Geist', system-ui, sans-serif;
               font-size: 13px;
               margin-bottom: 12px;
               outline: none;
               display: block;
               transition: border-color 0.2s;
            }
            .nb-form-input::placeholder { color: rgba(240,235,227,0.45); }
            .nb-form-input:focus { border-bottom-color: rgba(240,235,227,0.8); }

            .nb-form-btn {
               width: 100%;
               background: #f0ebe3;
               color: #1a1612;
               font-family: 'Fraunces', Georgia, serif;
               font-weight: 300;
               font-style: italic;
               font-size: 18px;
               padding: 14px 24px;
               border: none;
               cursor: pointer;
               display: flex;
               align-items: center;
               justify-content: center;
               gap: 10px;
               transition: background 0.2s, color 0.2s;
               margin-top: 4px;
            }
            .nb-form-btn:hover { background: #1a1612; color: #f0ebe3; }

            .nb-action-btn {
               background: transparent;
               border: 1px solid ${N.line};
               padding: 10px 16px;
               font-family: 'JetBrains Mono', ui-monospace, monospace;
               font-size: 9px;
               letter-spacing: 0.16em;
               text-transform: uppercase;
               color: ${N.inkSoft};
               cursor: pointer;
               display: flex;
               align-items: center;
               justify-content: center;
               gap: 8px;
               transition: border-color 0.2s, color 0.2s;
            }
            .nb-action-btn:hover { border-color: ${N.terra}; color: ${N.terra}; }
         `}</style>
      </div>
   )
}

export default NubiaPropertyDetail
