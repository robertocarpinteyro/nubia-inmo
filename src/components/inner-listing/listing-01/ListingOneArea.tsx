"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactPaginate from "react-paginate"
import NiceSelect from "@/ui/NiceSelect"
import DropdownOne from "@/components/search-dropdown/inner-dropdown/DropdownOne"

import icon from "@/assets/images/icon/icon_46.svg"

interface Property {
   id: number
   title: string
   price: number
   address: string
   bedrooms: number
   bathrooms: number
   totalArea: number
   transactionType: string
   status: string
   images?: string[]
}

const ListingOneArea = () => {
   const [properties, setProperties] = useState<Property[]>([])
   const [loading, setLoading] = useState(true)

   // Pagination State
   const [currentPage, setCurrentPage] = useState(0)
   const [totalPages, setTotalPages] = useState(1)
   const [totalProperties, setTotalProperties] = useState(0)
   const itemsPerPage = 8

   const fetchProperties = (pageIndex: number) => {
      setLoading(true)
      fetch(`http://localhost:5001/api/properties?page=${pageIndex + 1}&limit=${itemsPerPage}`)
         .then((r) => r.json())
         .then((data) => {
            setProperties(data.properties || [])
            setTotalPages(data.pagination?.totalPages || 1)
            setTotalProperties(data.pagination?.total || 0)
         })
         .catch((err) => console.error(err))
         .finally(() => setLoading(false))
   }

   useEffect(() => {
      fetchProperties(currentPage)
   }, [currentPage])

   const handlePageClick = (event: { selected: number }) => {
      setCurrentPage(event.selected)
      window.scrollTo({ top: 0, behavior: "smooth" })
   }

   return (
      <div className="property-listing-six bg-pink-two pt-110 md-pt-80 pb-150 xl-pb-120 mt-150 xl-mt-120">
         <div className="container container-large">
            <div className="row">
               <div className="col-lg-8">
                  <div className="ps-xxl-5">
                     <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
                        <div>
                           Mostrando <span className="color-dark fw-500">{properties.length > 0 ? currentPage * itemsPerPage + 1 : 0}–{currentPage * itemsPerPage + properties.length}</span> de <span
                           className="color-dark fw-500">{totalProperties}</span> resultados
                        </div>
                        <div className="d-flex align-items-center xs-mt-20">
                           <div className="short-filter d-flex align-items-center">
                              <div className="fs-16 me-2">Ordenar por:</div>
                              <select className="form-select" style={{ width: "auto", border: "none", background: "transparent", fontWeight: 500 }}>
                                 <option value="newest">Más recientes</option>
                                 <option value="price_low">Precio: Menor a Mayor</option>
                                 <option value="price_high">Precio: Mayor a Menor</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     {loading ? (
                        <div className="text-center py-5">
                           <div className="spinner-border" style={{ color: "#7B4FFF" }} role="status">
                              <span className="visually-hidden">Cargando...</span>
                           </div>
                        </div>
                     ) : properties.length === 0 ? (
                        <div className="text-center py-5 bg-white border-20" style={{ minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                           <i className="bi bi-house-x" style={{ fontSize: "56px", color: "rgba(0,0,0,0.2)" }}></i>
                           <h3 className="mt-3">No hay propiedades</h3>
                           <p className="text-muted fs-18">No encontramos propiedades disponibles en este momento.</p>
                        </div>
                     ) : (
                        <>
                           <div className="row gx-xxl-5">
                              {properties.map((item) => (
                                 <div key={item.id} className="col-md-6 d-flex mb-50 wow fadeInUp">
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
                                          <div className="address">{item.address || "Dirección no disponible"}</div>
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
                           
                           {totalPages > 1 && (
                              <ReactPaginate
                                 breakLabel="..."
                                 nextLabel={<Image src={icon} alt="" className="ms-2" />}
                                 onPageChange={handlePageClick}
                                 pageRangeDisplayed={3}
                                 pageCount={totalPages}
                                 previousLabel={<Image src={icon} alt="" className="ms-2" style={{ transform: "rotate(180deg)" }}/>}
                                 renderOnZeroPageCount={null}
                                 forcePage={currentPage}
                                 className="pagination-one d-flex align-items-center justify-content-center justify-content-sm-start style-none pt-30"
                              />
                           )}
                        </>
                     )}
                  </div>
               </div>

               <div className="col-lg-4 order-lg-first">
                  <div className="advance-search-panel dot-bg md-mt-80">
                     <div className="main-bg">
                        <DropdownOne
                           handleSearchChange={() => {}}
                           handleBedroomChange={() => {}}
                           handleBathroomChange={() => {}}
                           handlePriceChange={() => {}}
                           maxPrice={10000000}
                           priceValue={[0, 10000000]}
                           handleResetFilter={() => {}}
                           selectedAmenities={[]}
                           handleAmenityChange={() => {}}
                           handleLocationChange={() => {}}
                           handleStatusChange={() => {}}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ListingOneArea
