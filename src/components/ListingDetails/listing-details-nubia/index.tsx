"use client"
import { useEffect, useState } from "react"
import MediaGallery from "@/components/ListingDetails/listing-details-6/MediaGallery"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { API_BASE_URL } from "@/context/AuthContext"
import HeaderTwo from "@/layouts/headers/HeaderTwo"
import NubiaFooter from "@/components/homes/home-two/NubiaFooter"
import BeforeAfterSlider from "@/components/common/BeforeAfterSlider"

// ── Design tokens (espejo del SCSS del home) ──────────────────
const C = {
   dark:    "#182D40",
   dark2:   "#142537",
   dark3:   "#1D3347",
   gold:    "#D9A76A",
   gold2:   "#E8C08E",
   gold3:   "rgba(217,167,106,0.12)",
   steel:   "#6D7E8C",
   border:  "rgba(255,255,255,0.1)",
   border2: "rgba(255,255,255,0.06)",
   white:   "#ffffff",
   w55:     "rgba(255,255,255,0.55)",
   w35:     "rgba(255,255,255,0.35)",
   w25:     "rgba(255,255,255,0.25)",
   w10:     "rgba(255,255,255,0.10)",
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
   const q = url.match(/[?&]q=([^&]+)/)
   if (q) return `https://maps.google.com/maps?q=${q[1]}&z=15&output=embed`
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

   const statusMap: Record<string, { label: string; color: string }> = {
      disponible: { label: "Disponible",  color: C.gold },
      available:  { label: "Disponible",  color: C.gold },
      vendida:    { label: "Vendida",     color: C.steel },
      sold:       { label: "Vendida",     color: C.steel },
      rentada:    { label: "Rentada",     color: C.gold2 },
      rented:     { label: "Rentada",     color: C.gold2 },
      en_proceso: { label: "En Proceso",  color: C.w55 },
   }

   // ── Loading ──────────────────────────────────────────────
   if (loading) {
      return (
         <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
               <div className="nubia-loader" />
               <p style={{ color: C.w35, marginTop: "24px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Cargando
               </p>
            </div>
         </div>
      )
   }

   // ── Not found ────────────────────────────────────────────
   if (!property) {
      return (
         <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
               <p style={{ fontSize: "120px", fontWeight: 900, lineHeight: 1, color: C.border, letterSpacing: "-0.06em", margin: 0 }}>404</p>
               <p style={{ color: C.w55, fontSize: "16px", letterSpacing: "0.05em", marginBottom: "32px" }}>Propiedad no encontrada</p>
               <Link href="/" className="btn-nubia-primary">Volver al inicio</Link>
            </div>
         </div>
      )
   }

   const statusInfo = statusMap[property.status] || { label: property.status, color: C.w55 }
   const isVenta = property.transactionType === "venta"
   const videoInfo       = property.videoUrl ? parseVideoUrl(property.videoUrl)       : null
   const videoPlayerInfo = property.videoUrl ? parseVideoUrlPlayer(property.videoUrl) : null
   const mapsEmbedUrl    = property.googleMapsUrl ? toMapsEmbed(property.googleMapsUrl) : null
   const isLote    = property.propertyType === "lote"
   const beforeImg = property.media?.find(m => m.mediaType === "image")?.url || null
   const afterImg  = property.media?.find(m => m.mediaType === "render")?.url || null

   const specs = [
      { icon: "bi-house",        value: property.propertyType,                                          label: "Tipo" },
      { icon: "bi-door-open",    value: property.bedrooms != null ? String(property.bedrooms) : null,   label: "Recámaras" },
      { icon: "bi-droplet",      value: property.bathrooms || null,                                     label: "Baños" },
      { icon: "bi-aspect-ratio", value: property.totalArea   ? `${property.totalArea} m²`   : null,     label: "Superficie" },
      { icon: "bi-rulers",       value: property.builtArea   ? `${property.builtArea} m²`   : null,     label: "Construida" },
      { icon: "bi-car-front",    value: property.parkingSpaces ? String(property.parkingSpaces) : null, label: "Estacionam." },
   ].filter(s => s.value !== null) as { icon: string; value: string; label: string }[]

   return (
      <div className="nubia-home nubia-pdp" style={{ background: C.dark, minHeight: "100vh" }}>

         {/* ══════════════════════════════════════════════════
             HERO
         ══════════════════════════════════════════════════ */}
         <div style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden", background: C.dark2 }}>

            {/* Fondo — video o imagen */}
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
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(24,45,64,0.82) 0%, rgba(24,45,64,0.55) 55%, rgba(24,45,64,0.2) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(24,45,64,0.95) 0%, rgba(24,45,64,0.3) 50%, transparent 100%)" }} />

            {/* Header */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
               <HeaderTwo style_1={false} style_2={false} nubia={true} />
            </div>

            {/* Contenido hero */}
            <div style={{ position: "absolute", bottom: "96px", left: 0, right: 0, zIndex: 20 }}>
               <div className="container">

                  {/* Breadcrumb */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.w35 }}>
                     <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link>
                     <span style={{ opacity: 0.4 }}>/</span>
                     <Link href="/listing_07" style={{ color: "inherit", textDecoration: "none" }}>Propiedades</Link>
                     <span style={{ opacity: 0.4 }}>/</span>
                     <span style={{ color: C.gold }}>{property.title}</span>
                  </div>

                  {/* Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                     <span className="card-tag" style={{ position: "static" }}>
                        {isVenta ? "Venta" : "Renta"}
                     </span>
                     <span style={{ background: C.gold3, border: `1px solid rgba(217,167,106,0.3)`, borderRadius: "2px", padding: "5px 12px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: statusInfo.color }}>
                        {statusInfo.label}
                     </span>
                     {property.featured && (
                        <span style={{ background: C.gold3, border: `1px solid rgba(217,167,106,0.3)`, borderRadius: "2px", padding: "5px 12px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold }}>
                           Destacada
                        </span>
                     )}
                  </div>

                  <div className="row align-items-end g-4">
                     <div className="col-lg-8">
                        <h1 style={{ fontWeight: 900, fontSize: "clamp(2.4rem, 6vw, 72px)", color: C.white, letterSpacing: "-0.04em", lineHeight: 0.92, marginBottom: "18px", textTransform: "uppercase" }}>
                           {property.title}
                        </h1>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: C.w55 }}>
                           <i className="bi bi-geo-alt" style={{ color: C.gold, fontSize: "14px" }}></i>
                           {[property.address, property.city, property.state].filter(Boolean).join(", ")}
                        </div>
                     </div>
                     <div className="col-lg-4 text-lg-end">
                        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.w35, marginBottom: "8px" }}>
                           Precio {isVenta ? "de venta" : "mensual"}
                        </div>
                        {property.discountPrice && property.discountPrice > 0 ? (
                           <div>
                              <div style={{ fontSize: "16px", fontWeight: 700, color: C.w35, textDecoration: "line-through", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                                 {formatPrice(property.price, property.currency)}
                              </div>
                              <div style={{ fontSize: "clamp(2rem, 4.5vw, 52px)", fontWeight: 900, color: C.gold, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                 {formatPrice(property.discountPrice, property.currency)}
                              </div>
                           </div>
                        ) : (
                           <div style={{ fontSize: "clamp(2rem, 4.5vw, 52px)", fontWeight: 900, color: C.gold, letterSpacing: "-0.04em", lineHeight: 1 }}>
                              {formatPrice(property.price, property.currency)}
                           </div>
                        )}
                        {!isVenta && <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", color: C.w35, marginTop: "4px" }}>/MES</div>}
                     </div>
                  </div>
               </div>
            </div>

            {/* Scroll cue */}
            <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
               <div style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, transparent, ${C.w25})` }} />
               <i className="bi bi-chevron-down" style={{ color: C.w25, fontSize: "13px" }}></i>
            </div>
         </div>

         {/* ══════════════════════════════════════════════════
             GALERÍA
         ══════════════════════════════════════════════════ */}
         {images.length > 0 && (
            <div style={{ padding: "64px 0 0", borderTop: `1px solid ${C.border2}` }}>
               <div className="container">
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px" }}>
                     <div>
                        <span className="section-label" style={{ color: C.gold }}>Fotografías</span>
                        <h2 className="section-heading" style={{ fontSize: "clamp(1.8rem, 4vw, 48px)" }}>Galería</h2>
                     </div>
                     <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.w35 }}>
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
            <div style={{ padding: "64px 0 0" }}>
               <div className="container">
                  <div style={{ marginBottom: "28px" }}>
                     <span className="section-label" style={{ color: C.gold }}>Proyección</span>
                     <h2 className="section-heading" style={{ fontSize: "clamp(1.8rem, 4vw, 48px)" }}>Antes / Después</h2>
                  </div>
                  <div style={{ border: `1px solid ${C.border2}`, overflow: "hidden", borderRadius: "2px" }}>
                     <BeforeAfterSlider before={beforeImg} after={afterImg} />
                  </div>
               </div>
            </div>
         )}

         {/* ══════════════════════════════════════════════════
             VIDEO
         ══════════════════════════════════════════════════ */}
         {videoPlayerInfo && (
            <div style={{ padding: "64px 0 0" }}>
               <div className="container">
                  <div style={{ marginBottom: "28px" }}>
                     <span className="section-label" style={{ color: C.gold }}>Recorrido virtual</span>
                     <h2 className="section-heading" style={{ fontSize: "clamp(1.8rem, 4vw, 48px)" }}>Video</h2>
                  </div>
                  <div style={{ position: "relative", border: `1px solid ${C.border2}`, borderRadius: "2px", overflow: "hidden", aspectRatio: "16/9", background: C.dark2 }}>
                     {videoPlayerInfo.type !== "direct" ? (
                        <iframe src={videoPlayerInfo.embedSrc} title="Video de la propiedad"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                           allowFullScreen
                           style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
                     ) : (
                        <video controls src={videoPlayerInfo.embedSrc}
                           style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: C.dark2 }} />
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* ══════════════════════════════════════════════════
             SPECS BAR
         ══════════════════════════════════════════════════ */}
         {specs.length > 0 && (
            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.dark2, marginTop: "64px" }}>
               <div className="container">
                  <div className="row g-0">
                     {specs.map((spec, i) => (
                        <div key={i} className="col-6 col-sm-4 col-md"
                           style={{ padding: "28px 24px", borderRight: i < specs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                           <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                              <i className={`bi ${spec.icon}`} style={{ fontSize: "20px", color: C.gold, flexShrink: 0 }}></i>
                              <div>
                                 <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.w35, marginBottom: "4px" }}>
                                    {spec.label}
                                 </div>
                                 <div style={{ fontSize: "18px", fontWeight: 700, color: C.white, textTransform: "capitalize", letterSpacing: "-0.01em" }}>
                                    {spec.value}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* ══════════════════════════════════════════════════
             CONTENIDO PRINCIPAL + SIDEBAR
         ══════════════════════════════════════════════════ */}
         <div style={{ padding: "64px 0 120px" }}>
            <div className="container">
               <div className="row g-5">

                  {/* ── Columna principal ── */}
                  <div className="col-xl-8">

                     {/* Descripción */}
                     <div style={{ background: C.dark3, border: `1px solid ${C.border2}`, borderRadius: "2px", padding: "40px", marginBottom: "20px" }}>
                        <span className="section-label" style={{ color: C.gold }}>Sobre la propiedad</span>
                        <h3 style={{ fontSize: "22px", fontWeight: 900, color: C.white, letterSpacing: "-0.03em", marginBottom: "20px" }}>
                           Descripción
                        </h3>
                        <p style={{ fontSize: "16px", color: C.w55, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                           {property.description ||
                              `Esta propiedad en ${property.address} ofrece una excelente oportunidad en el mercado inmobiliario. Con ${property.totalArea} m² de superficie${property.bedrooms ? `, ${property.bedrooms} recámaras` : ""}${property.bathrooms ? ` y ${property.bathrooms} baños` : ""}, está pensada para quienes buscan comodidad y calidad de vida.`}
                        </p>
                     </div>

                     {/* Detalles */}
                     <div style={{ background: C.dark3, border: `1px solid ${C.border2}`, borderRadius: "2px", padding: "40px", marginBottom: "20px" }}>
                        <span className="section-label" style={{ color: C.gold }}>Ficha técnica</span>
                        <h3 style={{ fontSize: "22px", fontWeight: 900, color: C.white, letterSpacing: "-0.03em", marginBottom: "28px" }}>
                           Detalles de la propiedad
                        </h3>
                        <div className="row g-0">
                           {[
                              { label: "Tipo",             value: property.propertyType },
                              { label: "Operación",        value: isVenta ? "Venta" : "Renta" },
                              ...(property.bedrooms != null ? [{ label: "Recámaras",  value: String(property.bedrooms) }] : []),
                              ...(property.bathrooms       ? [{ label: "Baños",       value: property.bathrooms }] : []),
                              ...(property.totalArea       ? [{ label: "Sup. total",  value: `${property.totalArea} m²` }] : []),
                              ...(property.builtArea       ? [{ label: "Sup. constr.",value: `${property.builtArea} m²` }] : []),
                              ...(property.parkingSpaces   ? [{ label: "Estacion.",   value: String(property.parkingSpaces) }] : []),
                              ...(property.yearBuilt       ? [{ label: "Año",         value: String(property.yearBuilt) }] : []),
                              { label: "Estado",           value: statusInfo.label },
                              ...(property.currency && property.currency !== "MXN" ? [{ label: "Moneda", value: property.currency }] : []),
                           ].map((d, i) => (
                              <div key={i} className="col-6 col-md-4"
                                 style={{ padding: "14px 0", borderBottom: `1px solid ${C.border2}` }}>
                                 <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.w35, marginBottom: "6px" }}>
                                    {d.label}
                                 </div>
                                 <div style={{ fontSize: "15px", fontWeight: 600, color: C.white, textTransform: "capitalize" }}>
                                    {d.value}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Ubicación */}
                     <div style={{ background: C.dark3, border: `1px solid ${C.border2}`, borderRadius: "2px", padding: "40px" }}>
                        <span className="section-label" style={{ color: C.gold }}>Localización</span>
                        <h3 style={{ fontSize: "22px", fontWeight: 900, color: C.white, letterSpacing: "-0.03em", marginBottom: "8px" }}>
                           Ubicación
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: C.w35, marginBottom: "20px" }}>
                           <i className="bi bi-geo-alt" style={{ color: C.gold }}></i>
                           {[property.address, property.city, property.state].filter(Boolean).join(", ")}
                        </div>
                        {mapsEmbedUrl ? (
                           <div style={{ border: `1px solid ${C.border2}`, borderRadius: "2px", overflow: "hidden" }}>
                              <iframe src={mapsEmbedUrl} width="100%" height="300"
                                 style={{ border: 0, display: "block", filter: "invert(0.9) hue-rotate(185deg) saturate(0.7) brightness(0.85)" }}
                                 allowFullScreen loading="lazy"
                                 referrerPolicy="no-referrer-when-downgrade"
                                 title="Ubicación de la propiedad" />
                           </div>
                        ) : (
                           <div style={{ border: `1px solid ${C.border2}`, borderRadius: "2px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", background: C.dark2 }}>
                              <div style={{ textAlign: "center" }}>
                                 <i className="bi bi-geo-alt" style={{ fontSize: "32px", color: C.border, display: "block", marginBottom: "10px" }}></i>
                                 <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.steel }}>Mapa no disponible</span>
                              </div>
                           </div>
                        )}
                     </div>

                  </div>

                  {/* ── Sidebar ── */}
                  <div className="col-xl-4">
                     <div style={{ position: "sticky", top: "100px" }}>

                        {/* Card de precio + CTA */}
                        <div style={{ background: C.dark3, border: `1px solid ${C.border2}`, borderRadius: "2px", padding: "32px", marginBottom: "12px" }}>
                           <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.w35, marginBottom: "8px" }}>
                              Precio {isVenta ? "de venta" : "mensual"}
                           </div>
                           {property.discountPrice && property.discountPrice > 0 ? (
                              <div style={{ marginBottom: "24px" }}>
                                 <div style={{ fontSize: "14px", fontWeight: 700, color: C.w35, textDecoration: "line-through", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                                    {formatPrice(property.price, property.currency)}
                                 </div>
                                 <div style={{ fontSize: "32px", fontWeight: 900, color: C.gold, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                    {formatPrice(property.discountPrice, property.currency)}
                                 </div>
                              </div>
                           ) : (
                              <div style={{ fontSize: "32px", fontWeight: 900, color: C.gold, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "24px" }}>
                                 {formatPrice(property.price, property.currency)}
                              </div>
                           )}
                           {!isVenta && (
                              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: C.w35, marginTop: "-18px", marginBottom: "24px" }}>/MES</div>
                           )}

                           <div style={{ display: "flex", gap: "10px" }}>
                              <button className="btn-nubia-primary" style={{ flex: 1, justifyContent: "center", fontSize: "14px" }}>
                                 Agendar visita
                              </button>
                              <button className="btn-nubia-ghost" style={{ padding: "0 16px", fontSize: "18px" }}
                                 title="Guardar">
                                 <i className="bi bi-heart"></i>
                              </button>
                           </div>
                        </div>

                        {/* Formulario de contacto */}
                        <div style={{ background: C.dark3, border: `1px solid ${C.border2}`, borderRadius: "2px", padding: "32px" }}>
                           <h5 style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.w55, marginBottom: "24px" }}>
                              Solicitar información
                           </h5>

                           {sent ? (
                              <div style={{ textAlign: "center", padding: "32px 0" }}>
                                 <i className="bi bi-check-circle" style={{ fontSize: "36px", color: C.gold, display: "block", marginBottom: "14px" }}></i>
                                 <p style={{ color: C.w55, fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                                    Mensaje enviado.<br />Te contactaremos pronto.
                                 </p>
                              </div>
                           ) : (
                              <form onSubmit={handleContact}>
                                 {[
                                    { placeholder: "Tu nombre",           key: "name",  type: "text" },
                                    { placeholder: "Correo electrónico",  key: "email", type: "email" },
                                    { placeholder: "Teléfono (opcional)", key: "phone", type: "tel" },
                                 ].map(({ placeholder, key, type }) => (
                                    <input key={key} type={type} placeholder={placeholder}
                                       value={contactForm[key as keyof typeof contactForm]}
                                       onChange={e => setContactForm(f => ({ ...f, [key]: e.target.value }))}
                                       required={key !== "phone"}
                                       className="nb-input"
                                    />
                                 ))}
                                 <textarea placeholder="¿Qué te interesa saber de esta propiedad?" rows={4}
                                    value={contactForm.message}
                                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                                    required className="nb-input"
                                    style={{ resize: "vertical", fontFamily: "inherit" }}
                                 />
                                 <button type="submit" className="btn-nubia-primary" style={{ width: "100%", justifyContent: "center" }}>
                                    Enviar mensaje
                                    <i className="bi bi-arrow-up-right"></i>
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

         {/* ── Estilos locales ──────────────────────────────── */}
         <style>{`
            .nubia-pdp .section-label {
               font-size: 12px;
               font-weight: 700;
               letter-spacing: 0.2em;
               text-transform: uppercase;
               color: ${C.gold};
               margin-bottom: 12px;
               display: block;
            }
            .nubia-pdp .section-heading {
               font-weight: 900;
               line-height: 0.95;
               letter-spacing: -0.03em;
               color: ${C.white};
               text-transform: uppercase;
               margin: 0;
            }
            .nubia-pdp .card-tag {
               background: ${C.gold};
               color: ${C.white};
               font-size: 11px;
               font-weight: 700;
               letter-spacing: 0.1em;
               text-transform: uppercase;
               padding: 5px 12px;
               border-radius: 2px;
               display: inline-block;
            }
            .nubia-pdp .btn-nubia-primary {
               display: inline-flex;
               align-items: center;
               gap: 10px;
               background: ${C.gold};
               color: ${C.white};
               font-size: 15px;
               font-weight: 600;
               letter-spacing: 0.01em;
               padding: 16px 32px;
               border-radius: 2px;
               text-decoration: none;
               border: none;
               cursor: pointer;
               transition: background 0.25s ease;
            }
            .nubia-pdp .btn-nubia-primary:hover { background: ${C.gold2}; color: ${C.white}; }
            .nubia-pdp .btn-nubia-ghost {
               display: inline-flex;
               align-items: center;
               justify-content: center;
               background: transparent;
               color: rgba(255,255,255,0.6);
               border: 1px solid ${C.border};
               border-radius: 2px;
               cursor: pointer;
               transition: all 0.25s ease;
            }
            .nubia-pdp .btn-nubia-ghost:hover { color: ${C.white}; border-color: rgba(255,255,255,0.3); }
            .nubia-pdp .nb-input {
               width: 100%;
               background: ${C.dark2};
               border: 1px solid ${C.border2};
               border-radius: 2px;
               padding: 12px 16px;
               color: ${C.white};
               font-size: 14px;
               margin-bottom: 10px;
               outline: none;
               display: block;
               transition: border-color 0.2s;
               font-family: inherit;
            }
            .nubia-pdp .nb-input::placeholder { color: rgba(255,255,255,0.2); }
            .nubia-pdp .nb-input:focus { border-color: rgba(217,167,106,0.5); }
            .nubia-loader {
               width: 32px;
               height: 32px;
               border: 2px solid rgba(217,167,106,0.15);
               border-top-color: ${C.gold};
               border-radius: 50%;
               animation: nb-spin 0.8s linear infinite;
               margin: 0 auto;
            }
            @keyframes nb-spin { to { transform: rotate(360deg); } }
         `}</style>
      </div>
   )
}

export default NubiaPropertyDetail
