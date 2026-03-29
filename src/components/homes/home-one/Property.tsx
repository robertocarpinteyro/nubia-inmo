"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import titleShape from "@/assets/images/shape/title_shape_03.svg"

interface PropertyAPI {
   id: number
   title: string
   price: number
   address: string
   propertyType: string
   transactionType: string
   bedrooms: number
   bathrooms: number
   totalArea: number
   status: string
   images?: string[]
}

const Property = () => {
   const [properties, setProperties] = useState<PropertyAPI[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetch("http://localhost:5000/api/properties?limit=6")
         .then((r) => r.json())
         .then((data) => {
            const props = data?.properties || []
            setProperties(props)
         })
         .catch((err) => console.error("Error fetching properties:", err))
         .finally(() => setLoading(false))
   }, [])

   return (
      <div className="property-listing-one bg-pink-two mt-150 xl-mt-120 pt-140 xl-pt-120 lg-pt-80 pb-180 xl-pb-120 lg-pb-100">
         <div className="container">
            <div className="position-relative">
               <div className="title-one text-center text-lg-start mb-45 xl-mb-30 lg-mb-20 wow fadeInUp">
                  <h3>Nuevas <span>Propiedades <Image src={titleShape} alt="" className="lazy-img" /></span></h3>
                  <p className="fs-22 mt-xs">Explora las propiedades más recientes en venta y renta.</p>
               </div>

               {loading ? (
                  <div className="text-center py-5">
                     <div className="spinner-border" style={{ color: "#7B4FFF" }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                     </div>
                  </div>
               ) : properties.length === 0 ? (
                  <div className="text-center py-5">
                     <i className="bi bi-house-x" style={{ fontSize: "48px", color: "rgba(0,0,0,0.2)" }}></i>
                     <h4 className="mt-3">Aún no hay propiedades</h4>
                     <p className="text-muted">No se encontraron propiedades disponibles en la base de datos en este momento.</p>
                  </div>
               ) : (
                  <div className="row gx-xxl-5">
                     {properties.map((item) => (
                        <div key={item.id} className="col-lg-4 col-md-6 d-flex mt-40 wow fadeInUp">
                           <div className="listing-card-one border-25 h-100 w-100 position-relative">
                              <div className="img-gallery p-15">
                                 <div className="position-relative border-25 overflow-hidden" style={{ height: "250px" }}>
                                    <div className={`tag border-25 ${item.transactionType === "venta" ? "bg-white text-dark" : "bg-dark text-white"}`}>
                                       {item.transactionType === "venta" ? "Venta" : "Renta"}
                                    </div>
                                    <Link href={`/listing_details_01?id=${item.id}`} className="d-block h-100">
                                       {item.images && item.images.length > 0 ? (
                                          <img src={item.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={item.title} />
                                       ) : (
                                          <div style={{ width: "100%", height: "100%", background: "#e8e8e4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                             <i className="bi bi-image" style={{ fontSize: "40px", color: "rgba(0,0,0,0.2)" }}></i>
                                          </div>
                                       )}
                                    </Link>
                                 </div>
                              </div>

                              <div className="property-info p-25">
                                 <Link href={`/listing_details_01?id=${item.id}`} className="title tran3s">{item.title}</Link>
                                 <div className="address">{item.address}</div>
                                 <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between mt-15 mb-20">
                                    <li className="d-flex align-items-center">
                                       <span className="fs-16"><i className="bi bi-arrows-fullscreen me-2"></i> {item.totalArea} m²</span>
                                    </li>
                                    <li className="d-flex align-items-center">
                                       <span className="fs-16"><i className="bi bi-door-open me-2"></i> {item.bedrooms} Rec</span>
                                    </li>
                                    <li className="d-flex align-items-center">
                                       <span className="fs-16"><i className="bi bi-droplet me-2"></i> {item.bathrooms} Baños</span>
                                    </li>
                                 </ul>
                                 <div className="pl-footer top-border d-flex align-items-center justify-content-between pt-3">
                                    <strong className="price fw-500 color-dark">
                                       ${Number(item.price).toLocaleString("es-MX")}
                                    </strong>
                                    <Link href={`/listing_details_01?id=${item.id}`} className="btn-four rounded-circle"><i className="bi bi-arrow-up-right"></i></Link>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default Property
