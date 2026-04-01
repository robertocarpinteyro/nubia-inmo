"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import MediaGallery from "./MediaGallery"
import LoginModal from "@/modals/LoginModal"
import { API_BASE_URL } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

interface PropertyMedia {
   id: number
   url: string
   mediaType: string
   sortOrder: number
   title?: string
}

interface Property {
   id: number
   title: string
   titleEn?: string
   description?: string
   descriptionEn?: string
   propertyType: string
   transactionType: string
   price: number
   currency: string
   address?: string
   city?: string
   state?: string
   zipCode?: string
   latitude?: number
   longitude?: number
   bedrooms?: number
   bathrooms?: number
   parkingSpaces?: number
   totalArea?: number
   builtArea?: number
   yearBuilt?: number
   status: string
   featured: boolean
   landingPageUrl?: string
   media?: PropertyMedia[]
   creator?: { id: number; name: string }
}

const formatPrice = (price: number, currency: string) =>
   new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

const typeLabel: Record<string, { es: string; en: string }> = {
   casa: { es: "Casa", en: "House" },
   departamento: { es: "Departamento", en: "Apartment" },
   terreno: { es: "Terreno", en: "Land" },
   oficina: { es: "Oficina", en: "Office" },
   local: { es: "Local Comercial", en: "Commercial" },
}

const statusLabel: Record<string, { es: string; en: string }> = {
   disponible: { es: "Disponible", en: "Available" },
   vendida: { es: "Vendida", en: "Sold" },
   rentada: { es: "Rentada", en: "Rented" },
   en_proceso: { es: "En Proceso", en: "In Process" },
}

// ── Icono SVG inline ─────────────────────────────────────
const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={d} />
   </svg>
)

const ListingDetailsSixArea = () => {
   const searchParams = useSearchParams()
   const propertyId = searchParams.get("id")
   const { lang } = useLanguage()
   const [property, setProperty] = useState<Property | null>(null)
   const [loading, setLoading] = useState(true)
   const [notFound, setNotFound] = useState(false)
   const [loginModal, setLoginModal] = useState(false)

   useEffect(() => {
      if (!propertyId) { setNotFound(true); setLoading(false); return }
      setLoading(true)
      fetch(`${API_BASE_URL}/properties/${propertyId}`)
         .then(r => { if (!r.ok) { setNotFound(true); return null } return r.json() })
         .then(data => { if (data) setProperty(data) })
         .catch(() => setNotFound(true))
         .finally(() => setLoading(false))
   }, [propertyId])

   // ── Loading ──────────────────────────────────────────
   if (loading) {
      return (
         <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2F2F2", paddingTop: 80 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
               <div style={{ width: 32, height: 32, border: "3px solid rgba(24,45,64,0.12)", borderTopColor: "#182D40", borderRadius: "50%", animation: "nubia-detail-spin 0.8s linear infinite" }} />
               <span style={{ fontSize: 13, color: "rgba(24,45,64,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {lang === "en" ? "Loading..." : "Cargando..."}
               </span>
            </div>
            <style>{`@keyframes nubia-detail-spin { to { transform: rotate(360deg); } }`}</style>
         </div>
      )
   }

   // ── Not found ────────────────────────────────────────
   if (notFound || !property) {
      return (
         <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2F2F2", paddingTop: 80 }}>
            <div style={{ textAlign: "center", maxWidth: 480 }}>
               <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(24,45,64,0.35)", marginBottom: 16 }}>404</div>
               <h3 style={{ fontSize: 28, fontWeight: 900, color: "#182D40", letterSpacing: "-0.03em", marginBottom: 12 }}>
                  {lang === "en" ? "Property not found" : "Propiedad no encontrada"}
               </h3>
               <p style={{ color: "rgba(24,45,64,0.5)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                  {lang === "en" ? "The property you're looking for doesn't exist or was removed." : "La propiedad que buscas no existe o fue eliminada."}
               </p>
               <Link href="/listing_07" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#182D40", color: "#fff", padding: "12px 28px", borderRadius: 2, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                  ← {lang === "en" ? "Back to listings" : "Ver propiedades"}
               </Link>
            </div>
         </div>
      )
   }

   const title = lang === "en" && property.titleEn ? property.titleEn : property.title
   const description = lang === "en" && property.descriptionEn ? property.descriptionEn : property.description
   const location = [property.address, property.city, property.state].filter(Boolean).join(", ")
   const transText = property.transactionType === "venta"
      ? (lang === "en" ? "For Sale" : "En Venta")
      : (lang === "en" ? "For Rent" : "En Renta")
   const pType = typeLabel[property.propertyType]?.[lang] || property.propertyType
   const pStatus = statusLabel[property.status]?.[lang] || property.status
   const mapSrc = property.latitude && property.longitude
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : null

   const details = [
      { label: lang === "en" ? "Type" : "Tipo", value: pType },
      { label: lang === "en" ? "Transaction" : "Operación", value: transText },
      { label: lang === "en" ? "Status" : "Estado", value: pStatus },
      { label: lang === "en" ? "Bedrooms" : "Recámaras", value: property.bedrooms ?? "—" },
      { label: lang === "en" ? "Bathrooms" : "Baños", value: property.bathrooms ?? "—" },
      { label: lang === "en" ? "Parking" : "Estacionamientos", value: property.parkingSpaces ?? "—" },
      { label: lang === "en" ? "Built Area" : "Área Construida", value: property.builtArea ? `${property.builtArea} m²` : "—" },
      { label: lang === "en" ? "Land Area" : "Área Terreno", value: property.totalArea ? `${property.totalArea} m²` : "—" },
      { label: lang === "en" ? "Year Built" : "Año Construido", value: property.yearBuilt ?? "—" },
      { label: lang === "en" ? "ZIP Code" : "C.P.", value: property.zipCode ?? "—" },
   ]

   return (
      <>
         <div style={{ background: "#F2F2F2", minHeight: "100vh", paddingTop: 80 }}>

            {/* ── Breadcrumb ───────────────────────────────── */}
            <div style={{ background: "#182D40", padding: "14px 0" }}>
               <div className="container">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
                     <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                        {lang === "en" ? "Home" : "Inicio"}
                     </Link>
                     <span>/</span>
                     <Link href="/listing_07" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                        {lang === "en" ? "Properties" : "Propiedades"}
                     </Link>
                     <span>/</span>
                     <span style={{ color: "#D9A76A" }}>{title}</span>
                  </div>
               </div>
            </div>

            {/* ── Property Header ──────────────────────────── */}
            <div style={{ background: "#182D40", paddingBottom: 40, paddingTop: 36 }}>
               <div className="container">
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
                     {/* Left: title + location */}
                     <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                           <span style={{ background: "#D9A76A", color: "#182D40", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 2 }}>
                              {transText}
                           </span>
                           <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 2 }}>
                              {pType}
                           </span>
                           {property.featured && (
                              <span style={{ background: "rgba(217,167,106,0.15)", border: "1px solid rgba(217,167,106,0.3)", color: "#D9A76A", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 2 }}>
                                 {lang === "en" ? "Featured" : "Destacada"}
                              </span>
                           )}
                        </div>
                        <h1 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 14px" }}>
                           {title}
                        </h1>
                        {location && (
                           <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                              </svg>
                              {location}
                           </div>
                        )}
                     </div>
                     {/* Right: price */}
                     <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                           {lang === "en" ? "Listed price" : "Precio de lista"}
                        </div>
                        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#D9A76A", letterSpacing: "-0.04em", lineHeight: 1 }}>
                           {formatPrice(property.price, property.currency || "MXN")}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
                           {pStatus}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* ── Gallery ──────────────────────────────────── */}
            <div style={{ background: "#fff", borderBottom: "1px solid rgba(24,45,64,0.07)" }}>
               <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <MediaGallery media={property.media || []} />
               </div>
            </div>

            {/* ── Main content ─────────────────────────────── */}
            <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
               <div className="row g-4">

                  {/* ── Left column ─────────────────────────── */}
                  <div className="col-xl-8">

                     {/* Descripción */}
                     <div style={{ background: "#fff", borderRadius: 4, padding: "36px 40px", marginBottom: 16, border: "1px solid rgba(24,45,64,0.06)" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D9A76A", marginBottom: 10 }}>
                           {lang === "en" ? "About this property" : "Sobre esta propiedad"}
                        </div>
                        <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, color: "#182D40", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
                           {lang === "en" ? "Overview" : "Descripción"}
                        </h2>
                        {description ? (
                           <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(24,45,64,0.65)", margin: 0 }}>{description}</p>
                        ) : (
                           <p style={{ fontSize: 15, color: "rgba(24,45,64,0.3)", margin: 0, fontStyle: "italic" }}>
                              {lang === "en" ? "No description available." : "Sin descripción disponible."}
                           </p>
                        )}
                     </div>

                     {/* Detalles */}
                     <div style={{ background: "#fff", borderRadius: 4, padding: "36px 40px", marginBottom: 16, border: "1px solid rgba(24,45,64,0.06)" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D9A76A", marginBottom: 10 }}>
                           {lang === "en" ? "Specs" : "Especificaciones"}
                        </div>
                        <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, color: "#182D40", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 28 }}>
                           {lang === "en" ? "Property Details" : "Detalles de la Propiedad"}
                        </h2>
                        <div className="row g-3">
                           {details.map(({ label, value }) => (
                              <div key={label} className="col-6 col-md-4">
                                 <div style={{ background: "#F2F2F2", borderRadius: 3, padding: "16px 18px", borderLeft: "3px solid #D9A76A" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(24,45,64,0.4)", marginBottom: 6 }}>
                                       {label}
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: 16, color: "#182D40", letterSpacing: "-0.01em" }}>
                                       {String(value)}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Mapa */}
                     <div style={{ background: "#fff", borderRadius: 4, padding: "36px 40px", marginBottom: 16, border: "1px solid rgba(24,45,64,0.06)" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D9A76A", marginBottom: 10 }}>
                           {lang === "en" ? "Where it is" : "Dónde está"}
                        </div>
                        <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, color: "#182D40", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 28 }}>
                           {lang === "en" ? "Location" : "Ubicación"}
                        </h2>
                        {mapSrc ? (
                           <div style={{ borderRadius: 3, overflow: "hidden", border: "1px solid rgba(24,45,64,0.08)" }}>
                              <iframe src={mapSrc} width="600" height="400" style={{ border: 0, display: "block" }}
                                 allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                 className="w-100" />
                           </div>
                        ) : (
                           <div style={{ background: "#F2F2F2", borderRadius: 3, padding: "48px 0", textAlign: "center", color: "rgba(24,45,64,0.3)", fontSize: 14 }}>
                              {lang === "en" ? "Map coordinates not available." : "Coordenadas no disponibles."}
                           </div>
                        )}
                     </div>

                     {/* Reseña */}
                     <div style={{ background: "#fff", borderRadius: 4, padding: "36px 40px", border: "1px solid rgba(24,45,64,0.06)" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D9A76A", marginBottom: 10 }}>
                           {lang === "en" ? "Reviews" : "Opiniones"}
                        </div>
                        <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, color: "#182D40", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>
                           {lang === "en" ? "Leave a Review" : "Dejar una Reseña"}
                        </h2>
                        <p style={{ fontSize: 14, color: "rgba(24,45,64,0.55)", lineHeight: 1.7, margin: 0 }}>
                           <a onClick={() => setLoginModal(true)} style={{ cursor: "pointer", color: "#182D40", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}>
                              {lang === "en" ? "Sign in" : "Inicia sesión"}
                           </a>{" "}
                           {lang === "en" ? "to post your review." : "para publicar tu reseña."}
                        </p>
                     </div>

                  </div>

                  {/* ── Sidebar ──────────────────────────────── */}
                  <div className="col-xl-4">
                     <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* CTA Visita */}
                        <div style={{ background: "#182D40", borderRadius: 4, padding: "32px 28px" }}>
                           <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                              {lang === "en" ? "Interested?" : "¿Te interesa?"}
                           </div>
                           <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 12 }}>
                              {lang === "en" ? "Schedule a Visit" : "Agendar una Visita"}
                           </h3>
                           <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
                              {lang === "en"
                                 ? "Contact us to schedule a property visit at your convenience."
                                 : "Contáctanos para agendar una visita a la propiedad a tu conveniencia."}
                           </p>
                           <Link href="/contact" style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                              background: "#D9A76A", color: "#182D40", textAlign: "center",
                              padding: "14px 0", borderRadius: 2, fontWeight: 800, fontSize: 13,
                              letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
                              transition: "background 0.2s",
                           }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#E8C08E")}
                              onMouseLeave={e => (e.currentTarget.style.background = "#D9A76A")}
                           >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                 <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                              </svg>
                              {lang === "en" ? "Contact an agent" : "Contactar agente"}
                           </Link>
                           <Link href="/listing_07" style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                              marginTop: 10, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)",
                              padding: "12px 0", borderRadius: 2, fontWeight: 700, fontSize: 12,
                              letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
                              border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.2s",
                           }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fff" }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)" }}
                           >
                              {lang === "en" ? "← All properties" : "← Ver todas"}
                           </Link>
                        </div>

                        {/* Datos rápidos */}
                        <div style={{ background: "#fff", borderRadius: 4, padding: "28px", border: "1px solid rgba(24,45,64,0.06)" }}>
                           <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D9A76A", marginBottom: 18 }}>
                              {lang === "en" ? "Quick info" : "Información rápida"}
                           </div>
                           <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                              {[
                                 { label: lang === "en" ? "Bedrooms" : "Recámaras", value: property.bedrooms, icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
                                 { label: lang === "en" ? "Bathrooms" : "Baños", value: property.bathrooms, icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
                                 { label: lang === "en" ? "Parking" : "Estacionamiento", value: property.parkingSpaces, icon: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" },
                                 { label: lang === "en" ? "Built area" : "Área construida", value: property.builtArea ? `${property.builtArea} m²` : null, icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
                                 { label: lang === "en" ? "Land area" : "Área terreno", value: property.totalArea ? `${property.totalArea} m²` : null, icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                              ].filter(i => i.value != null).map((item, idx, arr) => (
                                 <div key={item.label} style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "13px 0",
                                    borderBottom: idx < arr.length - 1 ? "1px solid rgba(24,45,64,0.06)" : "none",
                                 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                       <div style={{ width: 32, height: 32, borderRadius: 3, background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#325573" }}>
                                          <Icon d={item.icon} size={14} />
                                       </div>
                                       <span style={{ fontSize: 13, color: "rgba(24,45,64,0.55)" }}>{item.label}</span>
                                    </div>
                                    <strong style={{ fontSize: 15, fontWeight: 800, color: "#182D40" }}>{String(item.value)}</strong>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Agente */}
                        {property.creator && (
                           <div style={{ background: "#fff", borderRadius: 4, padding: "24px 28px", border: "1px solid rgba(24,45,64,0.06)" }}>
                              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D9A76A", marginBottom: 14 }}>
                                 {lang === "en" ? "Listed by" : "Publicado por"}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                 <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#182D40", display: "flex", alignItems: "center", justifyContent: "center", color: "#D9A76A", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                                    {property.creator.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: "#182D40" }}>{property.creator.name}</div>
                                    <div style={{ fontSize: 12, color: "rgba(24,45,64,0.4)", marginTop: 2 }}>NUBIA Inmobiliaria</div>
                                 </div>
                              </div>
                           </div>
                        )}

                     </div>
                  </div>
               </div>
            </div>
         </div>

         <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      </>
   )
}

export default ListingDetailsSixArea
