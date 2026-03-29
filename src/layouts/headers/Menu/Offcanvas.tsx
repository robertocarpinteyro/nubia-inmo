"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/context/AuthContext"

interface Property {
   id: number
   title: string
   titleEn?: string
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

const Offcanvas = ({ offCanvas, setOffCanvas }: any) => {
   const [properties, setProperties] = useState<Property[]>([])
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      if (!offCanvas) return
      setLoading(true)
      fetch(`${API_BASE_URL}/properties?limit=4&featured=true`)
         .then((r) => r.json())
         .then((data) => {
            const list: Property[] = data?.properties || []
            // Si no hay destacadas, trae las 4 más recientes
            if (list.length === 0) {
               return fetch(`${API_BASE_URL}/properties?limit=4`)
                  .then((r) => r.json())
                  .then((d) => setProperties(d?.properties || []))
            }
            setProperties(list)
         })
         .catch(() => setProperties([]))
         .finally(() => setLoading(false))
   }, [offCanvas])

   const getImage = (p: Property): string | null => {
      const img = p.media?.find((m) => m.mediaType === "image")
      return img?.url || null
   }

   const locationLabel = (p: Property) => {
      if (p.city && p.state) return `${p.city}, ${p.state}`
      if (p.city) return p.city
      if (p.address) return p.address
      return ""
   }

   return (
      <>
         <div className={`offcanvas offcanvas-end sidebar-nav ${offCanvas ? "show" : ""}`} id="sideNav">
            <div className="offcanvas-header">
               <div className="logo order-lg-0">
                  <Link href="/" className="d-flex align-items-center" onClick={() => setOffCanvas(false)}>
                     <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: "0.08em" }}>NUBIA</span>
                  </Link>
               </div>
               <button onClick={() => setOffCanvas(false)} type="button" className="btn-close" aria-label="Close" />
            </div>

            <div className="wrapper mt-60">
               <div className="d-flex flex-column h-100">
                  <div className="property-block">
                     <h4 className="title pb-25">Propiedades Destacadas</h4>

                     {loading && (
                        <div style={{ textAlign: "center", padding: "20px 0", opacity: 0.5, fontSize: 14 }}>
                           Cargando...
                        </div>
                     )}

                     {!loading && properties.length === 0 && (
                        <div style={{ textAlign: "center", padding: "20px 0", opacity: 0.5, fontSize: 14 }}>
                           Sin propiedades disponibles
                        </div>
                     )}

                     <div className="row">
                        {properties.map((p) => {
                           const imgSrc = getImage(p)
                           return (
                              <div key={p.id} className="col-12">
                                 <div className="listing-card-one shadow-none style-two mb-40">
                                    <div className="img-gallery">
                                       <div className="position-relative overflow-hidden" style={{ background: "#1a1a1a", minHeight: 160 }}>
                                          <div className="tag bg-white text-dark fw-500">
                                             {p.transactionType === "venta" ? "EN VENTA" : "EN RENTA"}
                                          </div>
                                          {imgSrc ? (
                                             <img
                                                src={imgSrc}
                                                className="w-100"
                                                alt={p.title}
                                                style={{ objectFit: "cover", height: 160 }}
                                             />
                                          ) : (
                                             <div style={{
                                                height: 160,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                opacity: 0.3,
                                                fontSize: 13,
                                             }}>
                                                Sin imagen
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                    <div className="property-info d-flex justify-content-between align-items-end pt-30">
                                       <div>
                                          <strong className="price fw-500 color-dark fs-3">
                                             {formatPrice(p.price, p.currency || "MXN")}
                                          </strong>
                                          <div className="address pt-5 m0" style={{ fontSize: 13, opacity: 0.7 }}>
                                             {locationLabel(p)}
                                          </div>
                                          <div style={{ fontSize: 12, marginTop: 2, fontWeight: 500 }}>
                                             {p.title}
                                          </div>
                                       </div>
                                       <Link
                                          href={`/listing_details_06?id=${p.id}`}
                                          className="btn-four mb-5"
                                          onClick={() => setOffCanvas(false)}
                                       >
                                          <i className="bi bi-arrow-up-right"></i>
                                       </Link>
                                    </div>
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>

                  <div className="address-block mt-50">
                     <h4 className="title pb-15">Contacto</h4>
                     <p>Monterrey, Nuevo León, México</p>
                     <p>¿Necesitas ayuda? <br /><Link href="tel:+528112345678">+52 (81) 1234-5678</Link></p>
                  </div>

                  <ul className="style-none d-flex flex-wrap w-100 justify-content-between align-items-center social-icon pt-25 mt-auto">
                     <li><Link href="#"><i className="fa-brands fa-whatsapp"></i></Link></li>
                     <li><Link href="#"><i className="fa-brands fa-x-twitter"></i></Link></li>
                     <li><Link href="#"><i className="fa-brands fa-instagram"></i></Link></li>
                     <li><Link href="#"><i className="fa-brands fa-facebook"></i></Link></li>
                  </ul>
               </div>
            </div>
         </div>
         <div onClick={() => setOffCanvas(false)} className={`offcanvas-backdrop fade ${offCanvas ? "show" : ""}`} />
      </>
   )
}

export default Offcanvas
