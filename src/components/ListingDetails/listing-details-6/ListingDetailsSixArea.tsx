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

const ListingDetailsSixArea = () => {
   const searchParams = useSearchParams()
   const propertyId = searchParams.get("id")
   const { lang } = useLanguage()
   const [property, setProperty] = useState<Property | null>(null)
   const [loading, setLoading] = useState(true)
   const [notFound, setNotFound] = useState(false)
   const [loginModal, setLoginModal] = useState(false)

   useEffect(() => {
      if (!propertyId) {
         setNotFound(true)
         setLoading(false)
         return
      }
      setLoading(true)
      fetch(`${API_BASE_URL}/properties/${propertyId}`)
         .then(r => {
            if (!r.ok) { setNotFound(true); return null }
            return r.json()
         })
         .then(data => { if (data) setProperty(data) })
         .catch(() => setNotFound(true))
         .finally(() => setLoading(false))
   }, [propertyId])

   if (loading) {
      return (
         <div className="listing-details-one theme-details-one mt-200 xl-mt-150 pb-150" style={{ textAlign: "center", paddingTop: 100 }}>
            <div style={{ opacity: 0.4, fontSize: 16 }}>{lang === "en" ? "Loading property..." : "Cargando propiedad..."}</div>
         </div>
      )
   }

   if (notFound || !property) {
      return (
         <div className="listing-details-one theme-details-one mt-200 xl-mt-150 pb-150">
            <div className="container" style={{ textAlign: "center", paddingTop: 80 }}>
               <h4>{lang === "en" ? "Property not found" : "Propiedad no encontrada"}</h4>
               <p style={{ opacity: 0.6, marginTop: 12 }}>
                  {lang === "en" ? "The property you're looking for doesn't exist or was removed." : "La propiedad que buscas no existe o fue eliminada."}
               </p>
               <Link href="/listing_07" className="btn-two rounded-0 mt-20" style={{ display: "inline-block", marginTop: 24 }}>
                  {lang === "en" ? "← Back to listings" : "← Ver todas las propiedades"}
               </Link>
            </div>
         </div>
      )
   }

   const title = lang === "en" && property.titleEn ? property.titleEn : property.title
   const description = lang === "en" && property.descriptionEn ? property.descriptionEn : property.description
   const location = [property.address, property.city, property.state].filter(Boolean).join(", ")
   const transText = property.transactionType === "venta"
      ? (lang === "en" ? "FOR SALE" : "EN VENTA")
      : (lang === "en" ? "FOR RENT" : "EN RENTA")
   const pType = typeLabel[property.propertyType]?.[lang] || property.propertyType
   const pStatus = statusLabel[property.status]?.[lang] || property.status

   const mapSrc = property.latitude && property.longitude
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : null

   return (
      <>
         <div className="listing-details-one theme-details-one mt-200 xl-mt-150 pb-150 xl-mb-120">
            <div className="container">

               {/* ── Banner / Header ── */}
               <div className="row mb-40">
                  <div className="col-lg-8">
                     <h3 className="property-titlee">{title}</h3>
                     <div className="d-flex flex-wrap mt-10 gap-2 align-items-center">
                        <div className="list-type text-uppercase mt-15 me-3 bg-white text-dark fw-500">{transText}</div>
                        <div className="address mt-15">
                           <i className="bi bi-geo-alt"></i> {location || (lang === "en" ? "Location not specified" : "Ubicación no especificada")}
                        </div>
                        {property.featured && (
                           <span className="mt-15" style={{ background: "#7B4FFF", color: "white", padding: "2px 10px", fontSize: 12, borderRadius: 4, fontWeight: 600 }}>
                              {lang === "en" ? "Featured" : "Destacada"}
                           </span>
                        )}
                     </div>
                  </div>
                  <div className="col-lg-4 text-lg-end">
                     <div className="d-inline-block md-mt-40">
                        <div className="price color-dark fw-500" style={{ fontSize: 28 }}>
                           {formatPrice(property.price, property.currency || "MXN")}
                        </div>
                        <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6 }}>
                           {pType} · {pStatus}
                        </div>
                        <ul className="style-none d-flex align-items-center action-btns mt-20">
                           <li><Link href="#" className="d-flex align-items-center justify-content-center tran3s"><i className="fa-light fa-heart"></i></Link></li>
                           <li><Link href="#" className="d-flex align-items-center justify-content-center tran3s"><i className="fa-light fa-bookmark"></i></Link></li>
                        </ul>
                     </div>
                  </div>
               </div>

               {/* ── Galería ── */}
               <MediaGallery media={property.media || []} />

               <div className="row pt-80 lg-pt-50">
                  <div className="col-xl-8">

                     {/* ── Descripción ── */}
                     <div className="property-overview bottom-line-dark pb-40 mb-60">
                        <h4 className="mb-20">{lang === "en" ? "Overview" : "Descripción"}</h4>
                        {description ? (
                           <p className="fs-20 lh-lg">{description}</p>
                        ) : (
                           <p className="fs-20 lh-lg" style={{ opacity: 0.4 }}>
                              {lang === "en" ? "No description available." : "Sin descripción disponible."}
                           </p>
                        )}
                     </div>

                     {/* ── Características ── */}
                     <div className="property-feature-accordion bottom-line-dark pb-40 mb-60">
                        <h4 className="mb-30">{lang === "en" ? "Property Details" : "Detalles de la Propiedad"}</h4>
                        <div className="row g-3">
                           {[
                              { label: lang === "en" ? "Type" : "Tipo", value: pType },
                              { label: lang === "en" ? "Transaction" : "Operación", value: transText },
                              { label: lang === "en" ? "Status" : "Estado", value: pStatus },
                              { label: lang === "en" ? "Bedrooms" : "Recámaras", value: property.bedrooms ?? "—" },
                              { label: lang === "en" ? "Bathrooms" : "Baños", value: property.bathrooms ?? "—" },
                              { label: lang === "en" ? "Parking" : "Estacionamientos", value: property.parkingSpaces ?? "—" },
                              { label: lang === "en" ? "Built Area" : "Área Construida", value: property.builtArea ? `${property.builtArea} m²` : "—" },
                              { label: lang === "en" ? "Land Area" : "Área Terreno", value: property.totalArea ? `${property.totalArea} m²` : "—" },
                              { label: lang === "en" ? "Year Built" : "Año Const.", value: property.yearBuilt ?? "—" },
                              { label: lang === "en" ? "ZIP Code" : "C.P.", value: property.zipCode ?? "—" },
                           ].map(({ label, value }) => (
                              <div key={label} className="col-sm-6 col-lg-4">
                                 <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "14px 18px" }}>
                                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.55, marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontWeight: 600, fontSize: 16 }}>{String(value)}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* ── Mapa ── */}
                     <div className="property-location bottom-line-dark pb-60 mb-60">
                        <h4 className="mb-40">{lang === "en" ? "Location" : "Ubicación"}</h4>
                        {mapSrc ? (
                           <div className="wrapper">
                              <div className="map-banner overflow-hidden">
                                 <div className="gmap_canvas h-100 w-100">
                                    <iframe src={mapSrc} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy"
                                       referrerPolicy="no-referrer-when-downgrade" className="w-100 h-100" />
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "40px 0", textAlign: "center", opacity: 0.4, fontSize: 14 }}>
                              {lang === "en" ? "Map coordinates not available." : "Coordenadas del mapa no disponibles."}
                           </div>
                        )}
                     </div>

                     {/* ── Dejar reseña ── */}
                     <div className="review-form">
                        <h4 className="mb-20">{lang === "en" ? "Leave a Review" : "Dejar una Reseña"}</h4>
                        <p className="fs-20 lh-lg pb-15">
                           <a onClick={() => setLoginModal(true)} style={{ cursor: "pointer" }}
                              className="color-dark fw-500 text-decoration-underline">
                              {lang === "en" ? "Sign in" : "Inicia sesión"}
                           </a>{" "}
                           {lang === "en" ? "to post your review." : "para publicar tu reseña."}
                        </p>
                     </div>

                  </div>

                  {/* ── Sidebar de contacto ── */}
                  <div className="col-xl-4">
                     <div className="listing-sidebar-scroll dot-bg ps-xl-5 md-mt-60">

                        {/* CTA Agendar Visita */}
                        <div style={{ background: "#0C0C0C", color: "white", borderRadius: 12, padding: "28px 24px", marginBottom: 24 }}>
                           <h5 style={{ color: "white", marginBottom: 8 }}>
                              {lang === "en" ? "Schedule a Visit" : "Agendar una Visita"}
                           </h5>
                           <p style={{ opacity: 0.65, fontSize: 14, marginBottom: 20 }}>
                              {lang === "en"
                                 ? "Interested? Contact us to schedule a property visit."
                                 : "¿Interesado? Contáctanos para agendar una visita a la propiedad."}
                           </p>
                           <Link href="/contact" style={{ display: "block", background: "#7B4FFF", color: "white", textAlign: "center", padding: "12px 0", borderRadius: 6, fontWeight: 600, fontSize: 14 }}>
                              {lang === "en" ? "Contact an agent" : "Contactar a un agente"}
                           </Link>
                        </div>

                        {/* Info del agente/creador */}
                        {property.creator && (
                           <div style={{ background: "#f8f8f8", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
                              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, marginBottom: 8 }}>
                                 {lang === "en" ? "Listed by" : "Publicado por"}
                              </div>
                              <div style={{ fontWeight: 600, fontSize: 16 }}>{property.creator.name}</div>
                              <div style={{ fontSize: 13, opacity: 0.55, marginTop: 4 }}>NUBIA Inmobiliaria</div>
                           </div>
                        )}

                        {/* Datos rápidos */}
                        <div style={{ background: "#f8f8f8", borderRadius: 12, padding: "20px 24px" }}>
                           <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, marginBottom: 16 }}>
                              {lang === "en" ? "Quick info" : "Información rápida"}
                           </div>
                           <div className="d-flex flex-column gap-3">
                              {property.bedrooms != null && (
                                 <div className="d-flex justify-content-between">
                                    <span style={{ opacity: 0.6, fontSize: 14 }}>{lang === "en" ? "Bedrooms" : "Recámaras"}</span>
                                    <strong>{property.bedrooms}</strong>
                                 </div>
                              )}
                              {property.bathrooms != null && (
                                 <div className="d-flex justify-content-between">
                                    <span style={{ opacity: 0.6, fontSize: 14 }}>{lang === "en" ? "Bathrooms" : "Baños"}</span>
                                    <strong>{property.bathrooms}</strong>
                                 </div>
                              )}
                              {property.parkingSpaces != null && (
                                 <div className="d-flex justify-content-between">
                                    <span style={{ opacity: 0.6, fontSize: 14 }}>{lang === "en" ? "Parking" : "Estacionamiento"}</span>
                                    <strong>{property.parkingSpaces}</strong>
                                 </div>
                              )}
                              {property.builtArea != null && (
                                 <div className="d-flex justify-content-between">
                                    <span style={{ opacity: 0.6, fontSize: 14 }}>{lang === "en" ? "Built area" : "Área construida"}</span>
                                    <strong>{property.builtArea} m²</strong>
                                 </div>
                              )}
                           </div>
                        </div>

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
