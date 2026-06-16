"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

interface Property {
   id: string
   propertyId: string
   title: string
   operation: string
   price: number | null
   currency: string
   city?: string | null
   state?: string | null
   bedrooms?: number | null
   bathrooms?: number | null
   area?: number | null
   thumb?: string | null
}

const formatPrice = (price: number | null, currency: string) =>
   price == null
      ? "—"
      : new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

const NubiaProperties = () => {
   const { lang } = useLanguage()
   const [properties, setProperties] = useState<Property[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetch(`/api/properties?featured=true&limit=3`)
         .then(r => r.json())
         .then(data => {
            const list: Property[] = data?.properties || []
            if (list.length > 0) { setProperties(list); return }
            return fetch(`/api/properties?limit=3`)
               .then(r => r.json())
               .then(d => setProperties(d?.properties || []))
         })
         .catch(() => setProperties([]))
         .finally(() => setLoading(false))
   }, [])

   const transTag = (t: string) =>
      t === "venta" ? (lang === "en" ? "For Sale" : "Venta") : (lang === "en" ? "For Rent" : "Renta")

   return (
      <div className="nubia-section-dark py-130 xl-py-100">
         <div className="container">
            <div className="row align-items-end mb-60">
               <div className="col-lg-8">
                  <span className="section-label">
                     {lang === "en" ? "Featured Properties" : "Propiedades Destacadas"}
                  </span>
                  <h2 className="section-heading">
                     {lang === "en" ? "New\nListings" : "Nuevos\nListados"}
                  </h2>
               </div>
               <div className="col-lg-4 text-lg-end">
                  <Link
                     href="/listing_07"
                     className="nubia-feature-block__link feature-link light"
                     style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                  >
                     {lang === "en" ? "View All" : "Ver Todas"}
                     <i className="bi bi-arrow-up-right" style={{ display: "flex", width: "36px", height: "36px", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", borderRadius: "50%" }}></i>
                  </Link>
               </div>
            </div>

            {loading ? (
               <div className="row g-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="col-lg-4 col-md-6">
                        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, height: 360 }} />
                     </div>
                  ))}
               </div>
            ) : properties.length === 0 ? (
               <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.4, color: "white" }}>
                  <i className="fa-light fa-building" style={{ fontSize: 48, display: "block", marginBottom: 12 }} />
                  <p>{lang === "en" ? "No properties available yet." : "Aún no hay propiedades disponibles."}</p>
               </div>
            ) : (
               <div className="row g-4">
                  {properties.map(p => (
                     <div key={p.id} className="col-lg-4 col-md-6">
                        <Link href={`/listing_details_nubia?id=${p.propertyId}`} className="nubia-property-card d-block text-decoration-none">
                           <div className="card-thumb" style={{ position: "relative", background: "#1a1a1a", overflow: "hidden" }}>
                              {p.thumb ? (
                                 <img src={p.thumb} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
                              ) : (
                                 <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: 13, color: "white" }}>
                                    {lang === "en" ? "No image" : "Sin imagen"}
                                 </div>
                              )}
                              <span className="card-tag">{transTag(p.operation)}</span>
                           </div>
                           <div className="card-body-inner">
                              <div className="card-price">{formatPrice(p.price, p.currency || "MXN")}</div>
                              <div className="card-title">{p.title}</div>
                              <div className="card-location">
                                 <i className="bi bi-geo-alt"></i>
                                 {[p.city, p.state].filter(Boolean).join(", ") || "—"}
                              </div>
                              <div className="card-meta">
                                 <div className="meta-item">
                                    <i className="bi bi-door-open"></i>
                                    {p.bedrooms ?? "—"} {lang === "en" ? "Bed" : "Rec"}
                                 </div>
                                 <div className="meta-item">
                                    <i className="bi bi-droplet"></i>
                                    {p.bathrooms ?? "—"} {lang === "en" ? "Bath" : "Baños"}
                                 </div>
                                 <div className="meta-item">
                                    <i className="bi bi-aspect-ratio"></i>
                                    {p.area || "—"} m²
                                 </div>
                              </div>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   )
}

export default NubiaProperties
