"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { API_BASE_URL } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

import featureIcon_1 from "@/assets/images/icon/icon_32.svg"
import featureIcon_2 from "@/assets/images/icon/icon_33.svg"
import featureIcon_3 from "@/assets/images/icon/icon_34.svg"

interface Property {
   id: number
   title: string
   titleEn?: string
   propertyType: string
   transactionType: string
   price: number
   discountPrice?: number
   currency: string
   address?: string
   city?: string
   state?: string
   bedrooms?: number
   bathrooms?: number
   totalArea?: number
   builtArea?: number
   status: string
   media?: { id: number; url: string; mediaType: string; sortOrder: number }[]
}

interface Filters {
   search: string
   propertyType: string
   transactionType: string
   minBedrooms: string
   minPrice: string
   maxPrice: string
   sortBy: string
}

const ITEMS_PER_PAGE = 6

const formatPrice = (price: number, currency: string) =>
   new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

const ListingFiveArea = () => {
   const { lang } = useLanguage()
   const [properties, setProperties] = useState<Property[]>([])
   const [total, setTotal] = useState(0)
   const [totalPages, setTotalPages] = useState(1)
   const [currentPage, setCurrentPage] = useState(1)
   const [loading, setLoading] = useState(true)
   const [filters, setFilters] = useState<Filters>({
      search: "",
      propertyType: "",
      transactionType: "",
      minBedrooms: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
   })

   const fetchProperties = useCallback(async (f: Filters, page: number) => {
      setLoading(true)
      try {
         const params = new URLSearchParams()
         params.set("page", String(page))
         params.set("limit", String(ITEMS_PER_PAGE))
         if (f.search) params.set("search", f.search)
         if (f.propertyType) params.set("propertyType", f.propertyType)
         if (f.transactionType) params.set("transactionType", f.transactionType)
         if (f.minBedrooms) params.set("bedrooms", f.minBedrooms)
         if (f.minPrice) params.set("minPrice", f.minPrice)
         if (f.maxPrice) params.set("maxPrice", f.maxPrice)

         const res = await fetch(`${API_BASE_URL}/properties?${params}`)
         const data = await res.json()
         let rows: Property[] = data?.properties || []

         if (f.sortBy === "price_low") rows = [...rows].sort((a, b) => a.price - b.price)
         if (f.sortBy === "price_high") rows = [...rows].sort((a, b) => b.price - a.price)

         setProperties(rows)
         setTotal(data?.pagination?.total || 0)
         setTotalPages(data?.pagination?.totalPages || 1)
      } catch {
         setProperties([])
      } finally {
         setLoading(false)
      }
   }, [])

   useEffect(() => {
      fetchProperties(filters, currentPage)
   }, [filters, currentPage, fetchProperties])

   const handleFilter = (key: keyof Filters, value: string) => {
      setFilters(prev => ({ ...prev, [key]: value }))
      setCurrentPage(1)
   }

   const resetFilters = () => {
      setFilters({ search: "", propertyType: "", transactionType: "", minBedrooms: "", minPrice: "", maxPrice: "", sortBy: "newest" })
      setCurrentPage(1)
   }

   const getCoverImage = (p: Property) =>
      p.media?.sort((a, b) => a.sortOrder - b.sortOrder).find(m => m.mediaType === "image")?.url || null

   const getTitle = (p: Property) => lang === "en" && p.titleEn ? p.titleEn : p.title

   const transLabel = (t: string) =>
      t === "venta" ? (lang === "en" ? "For Sale" : "En Venta") : (lang === "en" ? "For Rent" : "En Renta")

   const start = (currentPage - 1) * ITEMS_PER_PAGE + 1
   const end = Math.min(currentPage * ITEMS_PER_PAGE, total)

   const inputStyle: React.CSSProperties = {
      width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0",
      borderRadius: 4, fontSize: 14, marginBottom: 4,
   }
   const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", opacity: 0.6, marginBottom: 6, display: "block" }

   return (
      <div className="property-listing-six pt-200 xl-pt-150 pb-200 xl-pb-120">
         <div className="container container-large">
            <div className="row">

               {/* ── Grid principal ── */}
               <div className="col-lg-8">
                  <div className="ps-xxl-5">
                     {/* Header resultados + orden */}
                     <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
                        <div>
                           {loading ? (
                              <span style={{ opacity: 0.5 }}>{lang === "en" ? "Loading..." : "Cargando..."}</span>
                           ) : total === 0 ? (
                              <span>{lang === "en" ? "No results" : "Sin resultados"}</span>
                           ) : (
                              <span>
                                 {lang === "en" ? "Showing" : "Mostrando"}{" "}
                                 <span className="color-dark fw-500">{start}–{end}</span>{" "}
                                 {lang === "en" ? "of" : "de"}{" "}
                                 <span className="color-dark fw-500">{total}</span>
                              </span>
                           )}
                        </div>
                        <div className="d-flex align-items-center xs-mt-20 gap-2">
                           <span className="fs-16 me-2">{lang === "en" ? "Sort:" : "Ordenar:"}</span>
                           <select
                              value={filters.sortBy}
                              onChange={e => handleFilter("sortBy", e.target.value)}
                              style={{ padding: "6px 12px", border: "1px solid #e0e0e0", borderRadius: 4, fontSize: 14 }}
                           >
                              <option value="newest">{lang === "en" ? "Newest" : "Más recientes"}</option>
                              <option value="price_low">{lang === "en" ? "Price ↑" : "Precio ↑"}</option>
                              <option value="price_high">{lang === "en" ? "Price ↓" : "Precio ↓"}</option>
                           </select>
                        </div>
                     </div>

                     {/* Cards */}
                     {!loading && properties.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 0", opacity: 0.5 }}>
                           <i className="fa-light fa-building" style={{ fontSize: 48, display: "block", marginBottom: 16 }} />
                           <p>{lang === "en" ? "No properties match your filters." : "No hay propiedades con esos filtros."}</p>
                        </div>
                     ) : (
                        <div className="row gx-xxl-5">
                           {loading
                              ? Array.from({ length: 4 }).map((_, i) => (
                                 <div key={i} className="col-md-6 d-flex mb-50">
                                    <div style={{ width: "100%", background: "#f5f5f5", borderRadius: 8, minHeight: 300 }} />
                                 </div>
                              ))
                              : properties.map(p => {
                                 const cover = getCoverImage(p)
                                 return (
                                    <div key={p.id} className="col-md-6 d-flex mb-50 wow fadeInUp">
                                       <div className="listing-card-one style-two shadow-none h-100 w-100">
                                          <div className="img-gallery">
                                             <div className="position-relative overflow-hidden" style={{ background: "#111", minHeight: 200 }}>
                                                <div className="tag fw-500">{transLabel(p.transactionType)}</div>
                                                <Link href="#" className="fav-btn tran3s"><i className="fa-light fa-heart"></i></Link>
                                                {cover ? (
                                                   <Link href={`/listing_details_06?id=${p.id}`}>
                                                      <img src={cover} className="w-100" alt={p.title} style={{ objectFit: "cover", height: 210, display: "block" }} />
                                                   </Link>
                                                ) : (
                                                   <Link href={`/listing_details_06?id=${p.id}`} className="d-flex align-items-center justify-content-center" style={{ height: 210, opacity: 0.25, fontSize: 13 }}>
                                                      {lang === "en" ? "No image" : "Sin imagen"}
                                                   </Link>
                                                )}
                                             </div>
                                          </div>
                                          <div className="property-info pt-20">
                                             <Link href={`/listing_details_06?id=${p.id}`} className="title tran3s">
                                                {getTitle(p)}
                                             </Link>
                                             <div className="address">
                                                {[p.city, p.state].filter(Boolean).join(", ") || p.address || ""}
                                             </div>
                                             <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between pb-15 pt-5">
                                                <li className="d-flex align-items-center">
                                                   <Image src={featureIcon_1} alt="" className="lazy-img icon me-2" />
                                                   <span className="fs-16">
                                                      <span className="color-dark">{p.builtArea || p.totalArea || "—"}</span> m²
                                                   </span>
                                                </li>
                                                <li className="d-flex align-items-center">
                                                   <Image src={featureIcon_2} alt="" className="lazy-img icon me-2" />
                                                   <span className="fs-16">
                                                      <span className="color-dark">{p.bedrooms ?? "—"}</span> {lang === "en" ? "bed" : "rec"}
                                                   </span>
                                                </li>
                                                <li className="d-flex align-items-center">
                                                   <Image src={featureIcon_3} alt="" className="lazy-img icon me-2" />
                                                   <span className="fs-16">
                                                      <span className="color-dark">{p.bathrooms ?? "—"}</span> {lang === "en" ? "bath" : "baños"}
                                                   </span>
                                                </li>
                                             </ul>
                                             <div className="pl-footer top-border bottom-border d-flex align-items-center justify-content-between">
                                                <div className="card-price" style={{ fontSize: "1.45rem", fontWeight: 900, color: "#182D40", fontFamily: "Gordita, sans-serif", letterSpacing: "-0.03em", lineHeight: 1 }}>
                                                   {p.discountPrice && p.discountPrice > 0 ? (
                                                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                                                         <span style={{ textDecoration: "line-through", opacity: 0.5, fontSize: "0.7em" }}>
                                                            {formatPrice(p.price, p.currency || "MXN")}
                                                         </span>
                                                         <span>{formatPrice(p.discountPrice, p.currency || "MXN")}</span>
                                                      </div>
                                                   ) : (
                                                      formatPrice(p.price, p.currency || "MXN")
                                                   )}
                                                </div>
                                                <Link href={`/listing_details_06?id=${p.id}`} className="btn-four">
                                                   <i className="bi bi-arrow-up-right"></i>
                                                </Link>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 )
                              })}
                        </div>
                     )}

                     {/* Paginación */}
                     {totalPages > 1 && (
                        <div className="d-flex align-items-center justify-content-start gap-2 pt-60 lg-pt-30">
                           <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                              style={{ padding: "8px 14px", border: "1px solid #e0e0e0", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}>
                              ‹
                           </button>
                           {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                              <button key={n} onClick={() => setCurrentPage(n)}
                                 style={{ padding: "8px 14px", border: "1px solid #e0e0e0", background: n === currentPage ? "#7B4FFF" : "white", color: n === currentPage ? "white" : "inherit", cursor: "pointer", fontWeight: n === currentPage ? 700 : 400 }}>
                                 {n}
                              </button>
                           ))}
                           <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                              style={{ padding: "8px 14px", border: "1px solid #e0e0e0", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                              ›
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               {/* ── Sidebar de filtros ── */}
               <div className="col-lg-4 order-lg-first">
                  <div className="advance-search-panel dot-bg md-mt-80">
                     <div className="main-bg rounded-0 p-30">
                        <h6 style={{ fontWeight: 700, marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                           {lang === "en" ? "Filter" : "Filtrar"}
                        </h6>

                        <label style={labelStyle}>{lang === "en" ? "Search" : "Buscar"}</label>
                        <input
                           type="text"
                           style={inputStyle}
                           placeholder={lang === "en" ? "Title, address..." : "Título, dirección..."}
                           value={filters.search}
                           onChange={e => handleFilter("search", e.target.value)}
                        />

                        <label style={{ ...labelStyle, marginTop: 16 }}>{lang === "en" ? "Property type" : "Tipo de inmueble"}</label>
                        <select style={inputStyle} value={filters.propertyType} onChange={e => handleFilter("propertyType", e.target.value)}>
                           <option value="">{lang === "en" ? "All types" : "Todos"}</option>
                           <option value="casa">{lang === "en" ? "House" : "Casa"}</option>
                           <option value="departamento">{lang === "en" ? "Apartment" : "Departamento"}</option>
                           <option value="terreno">{lang === "en" ? "Land" : "Terreno"}</option>
                           <option value="oficina">{lang === "en" ? "Office" : "Oficina"}</option>
                           <option value="local">{lang === "en" ? "Commercial" : "Local"}</option>
                        </select>

                        <label style={{ ...labelStyle, marginTop: 16 }}>{lang === "en" ? "Transaction" : "Operación"}</label>
                        <select style={inputStyle} value={filters.transactionType} onChange={e => handleFilter("transactionType", e.target.value)}>
                           <option value="">{lang === "en" ? "All" : "Todas"}</option>
                           <option value="venta">{lang === "en" ? "For Sale" : "Venta"}</option>
                           <option value="renta">{lang === "en" ? "For Rent" : "Renta"}</option>
                        </select>

                        <label style={{ ...labelStyle, marginTop: 16 }}>{lang === "en" ? "Min. bedrooms" : "Recámaras mín."}</label>
                        <select style={inputStyle} value={filters.minBedrooms} onChange={e => handleFilter("minBedrooms", e.target.value)}>
                           <option value="">{lang === "en" ? "Any" : "Todas"}</option>
                           {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
                        </select>

                        <label style={{ ...labelStyle, marginTop: 16 }}>{lang === "en" ? "Min. price" : "Precio mínimo"}</label>
                        <input type="number" style={inputStyle} placeholder="0" value={filters.minPrice} onChange={e => handleFilter("minPrice", e.target.value)} />

                        <label style={{ ...labelStyle, marginTop: 8 }}>{lang === "en" ? "Max. price" : "Precio máximo"}</label>
                        <input type="number" style={inputStyle} placeholder="∞" value={filters.maxPrice} onChange={e => handleFilter("maxPrice", e.target.value)} />

                        <button
                           onClick={resetFilters}
                           style={{ marginTop: 20, width: "100%", padding: "10px 0", background: "transparent", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer", fontSize: 14 }}
                        >
                           {lang === "en" ? "Clear filters" : "Limpiar filtros"}
                        </button>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   )
}

export default ListingFiveArea
