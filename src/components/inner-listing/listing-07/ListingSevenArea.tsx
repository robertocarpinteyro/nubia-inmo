"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { API_BASE_URL } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

interface Property {
   id: number
   title: string
   titleEn?: string
   propertyType: string
   transactionType: string
   price: number
   currency: string
   address?: string
   city?: string
   state?: string
   bedrooms?: number
   bathrooms?: number
   totalArea?: number
   builtArea?: number
   status: string
   featured: boolean
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

const ITEMS_PER_PAGE = 9

const formatPrice = (price: number, currency: string) =>
   new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

// ── Skeleton card ──
const SkeletonCard = () => (
   <div style={{
      background: "#111111",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 4,
      overflow: "hidden",
   }}>
      <div style={{ height: 240, background: "linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)", backgroundSize: "200% 100%", animation: "nubia-shimmer 1.5s infinite" }} />
      <div style={{ padding: 24 }}>
         <div style={{ height: 12, background: "#1a1a1a", borderRadius: 2, marginBottom: 12, width: "40%" }} />
         <div style={{ height: 20, background: "#1a1a1a", borderRadius: 2, marginBottom: 8 }} />
         <div style={{ height: 14, background: "#1a1a1a", borderRadius: 2, marginBottom: 20, width: "60%" }} />
         <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 14, background: "#1a1a1a", borderRadius: 2, flex: 1 }} />)}
         </div>
         <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 16 }} />
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ height: 22, width: "45%", background: "#1a1a1a", borderRadius: 2 }} />
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a1a" }} />
         </div>
      </div>
   </div>
)

// ── Property Card ──
const PropertyCard = ({ p, lang }: { p: Property; lang: string }) => {
   const [imgIdx, setImgIdx] = useState(0)
   const [hovered, setHovered] = useState(false)
   const images = p.media?.filter(m => m.mediaType === "image").sort((a, b) => a.sortOrder - b.sortOrder).map(m => m.url) || []
   const cover = images[imgIdx] || null
   const title = lang === "en" && p.titleEn ? p.titleEn : p.title
   const location = [p.city, p.state].filter(Boolean).join(", ") || p.address || ""
   const isVenta = p.transactionType === "venta"

   return (
      <div
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
         style={{
            background: "#111111",
            border: `1px solid ${hovered ? "rgba(123,79,255,0.4)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 4,
            overflow: "hidden",
            transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(123,79,255,0.2)" : "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            height: "100%",
         }}
      >
         {/* ── Image ── */}
         <div style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <Link href={`/listing_details_nubia?id=${p.id}`} style={{ display: "block" }}>
               {cover ? (
                  <img
                     src={cover}
                     alt={title}
                     style={{
                        width: "100%",
                        height: 240,
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.5s ease",
                        transform: hovered ? "scale(1.04)" : "scale(1)",
                     }}
                  />
               ) : (
                  <div style={{
                     height: 240,
                     background: "#161616",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                     </svg>
                  </div>
               )}
            </Link>

            {/* Tags overlay */}
            <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
               <span style={{
                  background: isVenta ? "#7B4FFF" : "rgba(0,0,0,0.7)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: 2,
                  backdropFilter: "blur(8px)",
                  border: isVenta ? "none" : "1px solid rgba(255,255,255,0.2)",
               }}>
                  {isVenta ? (lang === "en" ? "For Sale" : "Venta") : (lang === "en" ? "For Rent" : "Renta")}
               </span>
               {p.featured && (
                  <span style={{
                     background: "rgba(0,0,0,0.7)",
                     color: "#FFD700",
                     fontSize: 10,
                     fontWeight: 700,
                     letterSpacing: "0.12em",
                     textTransform: "uppercase",
                     padding: "4px 10px",
                     borderRadius: 2,
                     backdropFilter: "blur(8px)",
                     border: "1px solid rgba(255,215,0,0.3)",
                  }}>
                     {lang === "en" ? "Featured" : "Destacada"}
                  </span>
               )}
            </div>

            {/* Image nav dots */}
            {images.length > 1 && (
               <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
                  {images.slice(0, 5).map((_, i) => (
                     <button
                        key={i}
                        onClick={e => { e.preventDefault(); setImgIdx(i) }}
                        style={{
                           width: i === imgIdx ? 16 : 6,
                           height: 6,
                           borderRadius: 3,
                           background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.4)",
                           border: "none",
                           cursor: "pointer",
                           padding: 0,
                           transition: "width 0.2s",
                        }}
                     />
                  ))}
               </div>
            )}
         </div>

         {/* ── Content ── */}
         <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Type label */}
            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: 8 }}>
               {p.propertyType}
            </div>

            {/* Title */}
            <Link href={`/listing_details_nubia?id=${p.id}`} style={{ textDecoration: "none" }}>
               <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: hovered ? "#F5F5F2" : "rgba(255,255,255,0.85)",
                  fontFamily: "Gordita, sans-serif",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                  marginBottom: 6,
                  transition: "color 0.2s",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
               }}>
                  {title}
               </h3>
            </Link>

            {/* Location */}
            {location && (
               <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 16 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {location}
               </div>
            )}

            {/* Specs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 18, flex: 1 }}>
               {[
                  { icon: <><path d="M21 3H3v18h18V3z" /><path d="M3 9h18M9 21V9" /></>, val: p.builtArea || p.totalArea, unit: "m²" },
                  { icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>, val: p.bedrooms, unit: lang === "en" ? "bed" : "rec" },
                  { icon: <><path d="M4 12h16M4 6h16M4 18h7" /></>, val: p.bathrooms, unit: lang === "en" ? "bath" : "baños" },
               ].filter(s => s.val !== undefined && s.val !== null).map((s, i) => (
                  <div key={i} style={{
                     display: "flex",
                     alignItems: "center",
                     gap: 6,
                     paddingRight: 16,
                     marginRight: 16,
                     borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(123,79,255,0.7)" strokeWidth="1.5">{s.icon}</svg>
                     <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                        <span style={{ color: "#F5F5F2", fontWeight: 600 }}>{s.val}</span> {s.unit}
                     </span>
                  </div>
               ))}
            </div>

            {/* Price + CTA */}
            <div style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               paddingTop: 16,
               borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
               <div>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 2 }}>
                     {isVenta ? (lang === "en" ? "Price" : "Precio") : (lang === "en" ? "Rent/mo" : "Renta/mes")}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#7B4FFF", fontFamily: "Gordita, sans-serif", letterSpacing: "-0.02em", lineHeight: 1 }}>
                     {formatPrice(p.price, p.currency || "MXN")}
                  </div>
               </div>
               <Link
                  href={`/listing_details_nubia?id=${p.id}`}
                  style={{
                     width: 40,
                     height: 40,
                     borderRadius: "50%",
                     background: hovered ? "#7B4FFF" : "rgba(123,79,255,0.12)",
                     border: `1px solid ${hovered ? "#7B4FFF" : "rgba(123,79,255,0.25)"}`,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     color: hovered ? "#fff" : "#9D7AFF",
                     transition: "all 0.25s",
                     textDecoration: "none",
                     flexShrink: 0,
                  }}
               >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
               </Link>
            </div>
         </div>
      </div>
   )
}

// ── Filtros input style ──
const filterInputStyle: React.CSSProperties = {
   width: "100%",
   background: "#0C0C0C",
   border: "1px solid rgba(255,255,255,0.08)",
   borderRadius: 2,
   padding: "10px 14px",
   color: "#F5F5F2",
   fontSize: 13,
   outline: "none",
   fontFamily: "inherit",
   appearance: "none",
}

// ── Main component ──
const ListingSevenArea = ({ style }: any) => {
   const { lang } = useLanguage()
   const searchParams = useSearchParams()
   const [properties, setProperties] = useState<Property[]>([])
   const [total, setTotal] = useState(0)
   const [totalPages, setTotalPages] = useState(1)
   const [currentPage, setCurrentPage] = useState(1)
   const [loading, setLoading] = useState(true)
   const [filtersOpen, setFiltersOpen] = useState(false)
   const [filters, setFilters] = useState<Filters>({
      search: searchParams.get("search") || "",
      propertyType: searchParams.get("propertyType") || "",
      transactionType: searchParams.get("transactionType") || "",
      minBedrooms: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
   })
   const searchRef = useRef<HTMLInputElement>(null)

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

   const activeFilterCount = [filters.propertyType, filters.transactionType, filters.minBedrooms, filters.minPrice, filters.maxPrice].filter(Boolean).length

   const start = (currentPage - 1) * ITEMS_PER_PAGE + 1
   const end = Math.min(currentPage * ITEMS_PER_PAGE, total)

   const L = (es: string, en: string) => lang === "en" ? en : es

   return (
      <div style={{ background: "#0C0C0C", minHeight: "100vh" }}>

         {/* ── HERO BANNER ── */}
         <div style={{
            paddingTop: 120,
            paddingBottom: 0,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
         }}>
            <div className="container">
               <div style={{ padding: "48px 0 40px" }}>
                  {/* Breadcrumb */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
                     <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                        {L("Inicio", "Home")}
                     </Link>
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                     <span style={{ color: "rgba(255,255,255,0.6)" }}>{L("Propiedades", "Properties")}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                     <div>
                        <h1 style={{
                           fontFamily: "Gordita, sans-serif",
                           fontWeight: 900,
                           fontSize: "clamp(2.5rem, 6vw, 72px)",
                           color: "#F5F5F2",
                           letterSpacing: "-0.04em",
                           lineHeight: 0.95,
                           margin: 0,
                        }}>
                           {L("Propiedades", "Properties")}
                        </h1>
                     </div>
                     {!loading && total > 0 && (
                        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", paddingBottom: 8 }}>
                           {L(`${total} propiedades disponibles`, `${total} properties available`)}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* ── FILTER BAR ── */}
         <div style={{
            background: "#111111",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 100,
         }}>
            <div className="container">
               <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", flexWrap: "wrap" }}>

                  {/* Search */}
                  <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180, maxWidth: 320 }}>
                     <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                     </svg>
                     <input
                        ref={searchRef}
                        type="text"
                        placeholder={L("Buscar...", "Search...")}
                        value={filters.search}
                        onChange={e => handleFilter("search", e.target.value)}
                        style={{ ...filterInputStyle, paddingLeft: 36 }}
                     />
                  </div>

                  {/* Transaction pills */}
                  <div style={{ display: "flex", gap: 4 }}>
                     {["", "venta", "renta"].map(v => (
                        <button key={v} onClick={() => handleFilter("transactionType", v)} style={{
                           padding: "8px 14px",
                           background: filters.transactionType === v ? "#7B4FFF" : "transparent",
                           border: `1px solid ${filters.transactionType === v ? "#7B4FFF" : "rgba(255,255,255,0.12)"}`,
                           borderRadius: 2,
                           color: filters.transactionType === v ? "#fff" : "rgba(255,255,255,0.5)",
                           fontSize: 12,
                           fontWeight: 600,
                           letterSpacing: "0.08em",
                           textTransform: "uppercase",
                           cursor: "pointer",
                           transition: "all 0.2s",
                        }}>
                           {v === "" ? L("Todo", "All") : v === "venta" ? L("Venta", "Sale") : L("Renta", "Rent")}
                        </button>
                     ))}
                  </div>

                  {/* Type select */}
                  <select
                     value={filters.propertyType}
                     onChange={e => handleFilter("propertyType", e.target.value)}
                     style={{ ...filterInputStyle, width: "auto", minWidth: 130, cursor: "pointer" }}
                  >
                     <option value="">{L("Tipo: Todos", "Type: All")}</option>
                     <option value="casa">{L("Casa", "House")}</option>
                     <option value="departamento">{L("Departamento", "Apartment")}</option>
                     <option value="terreno">{L("Terreno", "Land")}</option>
                     <option value="oficina">{L("Oficina", "Office")}</option>
                     <option value="local">{L("Local comercial", "Commercial")}</option>
                  </select>

                  {/* More filters toggle */}
                  <button
                     onClick={() => setFiltersOpen(o => !o)}
                     style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 14px",
                        background: filtersOpen ? "rgba(123,79,255,0.12)" : "transparent",
                        border: `1px solid ${filtersOpen ? "rgba(123,79,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                        borderRadius: 2,
                        color: filtersOpen ? "#9D7AFF" : "rgba(255,255,255,0.5)",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.2s",
                     }}
                  >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
                     </svg>
                     {L("Filtros", "Filters")}
                     {activeFilterCount > 0 && (
                        <span style={{ background: "#7B4FFF", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                           {activeFilterCount}
                        </span>
                     )}
                  </button>

                  {/* Sort */}
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                     <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {L("Ordenar", "Sort")}
                     </span>
                     <select
                        value={filters.sortBy}
                        onChange={e => handleFilter("sortBy", e.target.value)}
                        style={{ ...filterInputStyle, width: "auto", minWidth: 160, cursor: "pointer" }}
                     >
                        <option value="newest">{L("Más recientes", "Newest")}</option>
                        <option value="price_low">{L("Precio: menor a mayor", "Price: Low to High")}</option>
                        <option value="price_high">{L("Precio: mayor a menor", "Price: High to Low")}</option>
                     </select>
                  </div>
               </div>

               {/* Expanded filters */}
               {filtersOpen && (
                  <div style={{
                     padding: "16px 0 20px",
                     borderTop: "1px solid rgba(255,255,255,0.06)",
                     display: "flex",
                     gap: 12,
                     flexWrap: "wrap",
                     alignItems: "flex-end",
                  }}>
                     {/* Bedrooms */}
                     <div>
                        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{L("Recámaras mín.", "Min bedrooms")}</div>
                        <div style={{ display: "flex", gap: 4 }}>
                           {["", "1", "2", "3", "4", "5"].map(n => (
                              <button key={n} onClick={() => handleFilter("minBedrooms", n)} style={{
                                 width: 36, height: 36,
                                 background: filters.minBedrooms === n ? "#7B4FFF" : "transparent",
                                 border: `1px solid ${filters.minBedrooms === n ? "#7B4FFF" : "rgba(255,255,255,0.1)"}`,
                                 borderRadius: 2,
                                 color: filters.minBedrooms === n ? "#fff" : "rgba(255,255,255,0.4)",
                                 fontSize: 13,
                                 fontWeight: 600,
                                 cursor: "pointer",
                                 transition: "all 0.2s",
                              }}>
                                 {n === "" ? "∞" : `${n}+`}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Price range */}
                     <div>
                        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{L("Rango de precio", "Price range")}</div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                           <input
                              type="number"
                              placeholder="Min"
                              value={filters.minPrice}
                              onChange={e => handleFilter("minPrice", e.target.value)}
                              style={{ ...filterInputStyle, width: 110 }}
                           />
                           <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>
                           <input
                              type="number"
                              placeholder="Max"
                              value={filters.maxPrice}
                              onChange={e => handleFilter("maxPrice", e.target.value)}
                              style={{ ...filterInputStyle, width: 110 }}
                           />
                        </div>
                     </div>

                     {/* Clear */}
                     {activeFilterCount > 0 && (
                        <button onClick={resetFilters} style={{
                           display: "flex",
                           alignItems: "center",
                           gap: 6,
                           padding: "9px 16px",
                           background: "transparent",
                           border: "1px solid rgba(239,68,68,0.3)",
                           borderRadius: 2,
                           color: "rgba(239,68,68,0.7)",
                           fontSize: 12,
                           fontWeight: 600,
                           letterSpacing: "0.08em",
                           textTransform: "uppercase",
                           cursor: "pointer",
                           transition: "all 0.2s",
                        }}
                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLElement).style.color = "#EF4444" }}
                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.7)" }}
                        >
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                           {L("Limpiar filtros", "Clear filters")}
                        </button>
                     )}
                  </div>
               )}
            </div>
         </div>

         {/* ── GRID ── */}
         <div className="container" style={{ paddingTop: 56, paddingBottom: 100 }}>

            {/* Results count */}
            {!loading && (
               <div style={{ marginBottom: 32, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                  {total === 0 ? (
                     L("Sin resultados", "No results")
                  ) : (
                     <>
                        {L("Mostrando", "Showing")}{" "}
                        <span style={{ color: "#F5F5F2", fontWeight: 600 }}>{start}–{end}</span>{" "}
                        {L("de", "of")}{" "}
                        <span style={{ color: "#F5F5F2", fontWeight: 600 }}>{total}</span>{" "}
                        {L("propiedades", "properties")}
                     </>
                  )}
               </div>
            )}

            {/* Empty state */}
            {!loading && properties.length === 0 && (
               <div style={{ textAlign: "center", padding: "100px 0" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" style={{ display: "block", margin: "0 auto 20px" }}>
                     <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, letterSpacing: "0.05em" }}>
                     {L("No hay propiedades con esos filtros.", "No properties match your filters.")}
                  </p>
                  <button onClick={resetFilters} style={{ marginTop: 16, background: "transparent", border: "1px solid rgba(123,79,255,0.3)", color: "#9D7AFF", padding: "10px 20px", borderRadius: 2, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                     {L("Ver todas", "View all")}
                  </button>
               </div>
            )}

            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
               {loading
                  ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
                  : properties.map(p => <PropertyCard key={p.id} p={p} lang={lang} />)
               }
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && !loading && (
               <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, paddingTop: 64 }}>
                  <button
                     onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                     disabled={currentPage === 1}
                     style={{
                        width: 40, height: 40,
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 2,
                        color: currentPage === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                     }}
                  >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                     <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        style={{
                           width: 40, height: 40,
                           background: n === currentPage ? "#7B4FFF" : "transparent",
                           border: `1px solid ${n === currentPage ? "#7B4FFF" : "rgba(255,255,255,0.1)"}`,
                           borderRadius: 2,
                           color: n === currentPage ? "#fff" : "rgba(255,255,255,0.4)",
                           fontWeight: n === currentPage ? 700 : 400,
                           fontSize: 14,
                           cursor: "pointer",
                           transition: "all 0.2s",
                        }}
                     >
                        {n}
                     </button>
                  ))}

                  <button
                     onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                     disabled={currentPage === totalPages}
                     style={{
                        width: 40, height: 40,
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 2,
                        color: currentPage === totalPages ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                     }}
                  >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
               </div>
            )}
         </div>

         <style>{`
            @keyframes nubia-shimmer {
               0% { background-position: -200% 0; }
               100% { background-position: 200% 0; }
            }
            select option { background: #111111; color: #F5F5F2; }
            input[type="text"]::placeholder,
            input[type="number"]::placeholder { color: rgba(255,255,255,0.2); }
            input[type="text"]:focus,
            input[type="number"]:focus,
            select:focus { border-color: rgba(123,79,255,0.5) !important; outline: none; }
         `}</style>
      </div>
   )
}

export default ListingSevenArea
