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

// ── Skeleton ─────────────────────────────────────────────────────
const SkeletonCard = () => (
   <div style={{ background: "#fff", border: "1px solid rgba(24,45,64,0.07)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: 240, background: "linear-gradient(90deg,#f0f0ee 25%,#e8e8e4 50%,#f0f0ee 75%)", backgroundSize: "200% 100%", animation: "nubia-shimmer 1.5s infinite" }} />
      <div style={{ padding: 24 }}>
         <div style={{ height: 10, background: "#eee", borderRadius: 2, marginBottom: 14, width: "35%" }} />
         <div style={{ height: 18, background: "#eee", borderRadius: 2, marginBottom: 8 }} />
         <div style={{ height: 13, background: "#eee", borderRadius: 2, marginBottom: 22, width: "55%" }} />
         <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 13, background: "#eee", borderRadius: 2, flex: 1 }} />)}
         </div>
         <div style={{ height: 1, background: "rgba(24,45,64,0.06)", marginBottom: 16 }} />
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ height: 20, width: "42%", background: "#eee", borderRadius: 2 }} />
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#eee" }} />
         </div>
      </div>
   </div>
)

// ── Property Card ─────────────────────────────────────────────────
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
            background: "#fff",
            border: `1px solid ${hovered ? "rgba(217,167,106,0.5)" : "rgba(24,45,64,0.08)"}`,
            borderRadius: 4,
            overflow: "hidden",
            transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            boxShadow: hovered ? "0 16px 40px rgba(24,45,64,0.1), 0 0 0 1px rgba(217,167,106,0.2)" : "0 2px 8px rgba(24,45,64,0.04)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            height: "100%",
         }}
      >
         {/* Image */}
         <div style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <Link href={`/listing_details_nubia?id=${p.id}`} style={{ display: "block" }}>
               {cover ? (
                  <img src={cover} alt={title} style={{ width: "100%", height: 240, objectFit: "cover", display: "block", transition: "transform 0.5s ease", transform: hovered ? "scale(1.04)" : "scale(1)" }} />
               ) : (
                  <div style={{ height: 240, background: "#EBF0F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(24,45,64,0.15)" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                     </svg>
                  </div>
               )}
            </Link>

            {/* Tags */}
            <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
               <span style={{
                  background: isVenta ? "#D9A76A" : "#182D40",
                  color: isVenta ? "#182D40" : "#fff",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 2,
               }}>
                  {isVenta ? (lang === "en" ? "For Sale" : "Venta") : (lang === "en" ? "For Rent" : "Renta")}
               </span>
               {p.featured && (
                  <span style={{
                     background: "rgba(24,45,64,0.75)", color: "#D9A76A",
                     fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                     padding: "4px 10px", borderRadius: 2, backdropFilter: "blur(8px)",
                  }}>
                     {lang === "en" ? "Featured" : "Destacada"}
                  </span>
               )}
            </div>

            {/* Dots */}
            {images.length > 1 && (
               <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
                  {images.slice(0, 5).map((_, i) => (
                     <button key={i} onClick={e => { e.preventDefault(); setImgIdx(i) }} style={{
                        width: i === imgIdx ? 16 : 6, height: 6, borderRadius: 3,
                        background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.5)",
                        border: "none", cursor: "pointer", padding: 0, transition: "width 0.2s",
                     }} />
                  ))}
               </div>
            )}
         </div>

         {/* Content */}
         <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(24,45,64,0.35)", fontWeight: 700, marginBottom: 8 }}>
               {p.propertyType}
            </div>

            <Link href={`/listing_details_nubia?id=${p.id}`} style={{ textDecoration: "none" }}>
               <h3 style={{
                  fontSize: 16, fontWeight: 700, color: hovered ? "#182D40" : "rgba(24,45,64,0.85)",
                  fontFamily: "Gordita, sans-serif", letterSpacing: "-0.01em", lineHeight: 1.3,
                  marginBottom: 6, transition: "color 0.2s",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
               }}>
                  {title}
               </h3>
            </Link>

            {location && (
               <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(24,45,64,0.4)", fontSize: 13, marginBottom: 16 }}>
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
               ].filter(s => s.val !== undefined && s.val !== null).map((s, i, arr) => (
                  <div key={i} style={{
                     display: "flex", alignItems: "center", gap: 6,
                     paddingRight: 16, marginRight: 16,
                     borderRight: i < arr.length - 1 ? "1px solid rgba(24,45,64,0.08)" : "none",
                  }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#325573" strokeWidth="1.5">{s.icon}</svg>
                     <span style={{ fontSize: 13, color: "rgba(24,45,64,0.5)" }}>
                        <span style={{ color: "#182D40", fontWeight: 600 }}>{s.val}</span> {s.unit}
                     </span>
                  </div>
               ))}
            </div>

            {/* Price + CTA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(24,45,64,0.07)" }}>
               <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(24,45,64,0.3)", marginBottom: 3 }}>
                     {isVenta ? (lang === "en" ? "Price" : "Precio") : (lang === "en" ? "Rent/mo" : "Renta/mes")}
                  </div>
                  <div className="card-price" style={{ fontSize: 20, fontWeight: 900, color: "#182D40", fontFamily: "Gordita, sans-serif", letterSpacing: "-0.03em", lineHeight: 1 }}>
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
               </div>
               <Link href={`/listing_details_nubia?id=${p.id}`} style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: hovered ? "#D9A76A" : "rgba(217,167,106,0.1)",
                  border: `1px solid ${hovered ? "#D9A76A" : "rgba(217,167,106,0.3)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: hovered ? "#182D40" : "#D9A76A",
                  transition: "all 0.25s", textDecoration: "none", flexShrink: 0,
               }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
               </Link>
            </div>
         </div>
      </div>
   )
}

// ── Input style ───────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
   width: "100%",
   background: "#F2F2F2",
   border: "1px solid rgba(24,45,64,0.1)",
   borderRadius: 2,
   padding: "10px 14px",
   color: "#182D40",
   fontSize: 13,
   outline: "none",
   fontFamily: "inherit",
   appearance: "none",
}

// ── Main component ────────────────────────────────────────────────
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
      } catch { setProperties([]) }
      finally { setLoading(false) }
   }, [])

   useEffect(() => { fetchProperties(filters, currentPage) }, [filters, currentPage, fetchProperties])

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
   const end   = Math.min(currentPage * ITEMS_PER_PAGE, total)
   const L = (es: string, en: string) => lang === "en" ? en : es

   return (
      <div style={{ background: "#F2F2F2", minHeight: "100vh" }}>

         {/* ── PAGE HEADER ──────────────────────────────────────── */}
         <div style={{ background: "#182D40", paddingTop: 100 }}>
            <div className="container">
               <div style={{ padding: "40px 0 36px" }}>
                  {/* Breadcrumb */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 22 }}>
                     <Link href="/" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                        {L("Inicio", "Home")}
                     </Link>
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                     <span style={{ color: "#D9A76A" }}>{L("Propiedades", "Properties")}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                     <div>
                        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
                           NUBIA Inmobiliaria
                        </div>
                        <h1 style={{
                           fontFamily: "Gordita, sans-serif", fontWeight: 900,
                           fontSize: "clamp(2.4rem, 5.5vw, 64px)",
                           color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.95, margin: 0,
                        }}>
                           {L("Propiedades", "Properties")}
                        </h1>
                     </div>
                     {!loading && total > 0 && (
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", paddingBottom: 6 }}>
                           {L(`${total} propiedades disponibles`, `${total} available`)}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* ── FILTER BAR ───────────────────────────────────────── */}
         <div style={{
            background: "#fff",
            borderBottom: "1px solid rgba(24,45,64,0.08)",
            position: "sticky", top: 0, zIndex: 100,
            boxShadow: "0 2px 12px rgba(24,45,64,0.06)",
         }}>
            <div className="container">
               <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", flexWrap: "wrap" }}>

                  {/* Search */}
                  <div style={{ position: "relative", flex: "1 1 200px", minWidth: 160, maxWidth: 300 }}>
                     <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(24,45,64,0.3)", pointerEvents: "none" }}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                     </svg>
                     <input ref={searchRef} type="text" placeholder={L("Buscar...", "Search...")}
                        value={filters.search} onChange={e => handleFilter("search", e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 36 }} />
                  </div>

                  {/* Transaction pills */}
                  <div style={{ display: "flex", gap: 4 }}>
                     {(["", "venta", "renta"] as const).map(v => {
                        const active = filters.transactionType === v
                        return (
                           <button key={v} onClick={() => handleFilter("transactionType", v)} style={{
                              padding: "8px 14px",
                              background: active ? "#182D40" : "transparent",
                              border: `1px solid ${active ? "#182D40" : "rgba(24,45,64,0.15)"}`,
                              borderRadius: 2,
                              color: active ? "#fff" : "rgba(24,45,64,0.5)",
                              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                              cursor: "pointer", transition: "all 0.2s",
                           }}>
                              {v === "" ? L("Todo", "All") : v === "venta" ? L("Venta", "Sale") : L("Renta", "Rent")}
                           </button>
                        )
                     })}
                  </div>

                  {/* Type */}
                  <select value={filters.propertyType} onChange={e => handleFilter("propertyType", e.target.value)}
                     style={{ ...inputStyle, width: "auto", minWidth: 130, cursor: "pointer" }}>
                     <option value="">{L("Tipo: Todos", "Type: All")}</option>
                     <option value="casa">{L("Casa", "House")}</option>
                     <option value="departamento">{L("Departamento", "Apartment")}</option>
                     <option value="terreno">{L("Terreno", "Land")}</option>
                     <option value="oficina">{L("Oficina", "Office")}</option>
                     <option value="local">{L("Local comercial", "Commercial")}</option>
                  </select>

                  {/* More filters */}
                  <button onClick={() => setFiltersOpen(o => !o)} style={{
                     display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
                     background: filtersOpen ? "rgba(24,45,64,0.06)" : "transparent",
                     border: `1px solid ${filtersOpen ? "rgba(24,45,64,0.2)" : "rgba(24,45,64,0.12)"}`,
                     borderRadius: 2,
                     color: filtersOpen ? "#182D40" : "rgba(24,45,64,0.45)",
                     fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                     cursor: "pointer", transition: "all 0.2s",
                  }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
                     </svg>
                     {L("Filtros", "Filters")}
                     {activeFilterCount > 0 && (
                        <span style={{ background: "#D9A76A", color: "#182D40", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                           {activeFilterCount}
                        </span>
                     )}
                  </button>

                  {/* Sort */}
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                     <span style={{ fontSize: 11, color: "rgba(24,45,64,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {L("Ordenar", "Sort")}
                     </span>
                     <select value={filters.sortBy} onChange={e => handleFilter("sortBy", e.target.value)}
                        style={{ ...inputStyle, width: "auto", minWidth: 160, cursor: "pointer" }}>
                        <option value="newest">{L("Más recientes", "Newest")}</option>
                        <option value="price_low">{L("Precio: menor a mayor", "Price: Low to High")}</option>
                        <option value="price_high">{L("Precio: mayor a menor", "Price: High to Low")}</option>
                     </select>
                  </div>
               </div>

               {/* Expanded filters */}
               {filtersOpen && (
                  <div style={{ padding: "16px 0 20px", borderTop: "1px solid rgba(24,45,64,0.07)", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
                     {/* Bedrooms */}
                     <div>
                        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(24,45,64,0.4)", marginBottom: 8 }}>
                           {L("Recámaras mín.", "Min bedrooms")}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                           {["", "1", "2", "3", "4", "5"].map(n => {
                              const active = filters.minBedrooms === n
                              return (
                                 <button key={n} onClick={() => handleFilter("minBedrooms", n)} style={{
                                    width: 36, height: 36,
                                    background: active ? "#182D40" : "transparent",
                                    border: `1px solid ${active ? "#182D40" : "rgba(24,45,64,0.12)"}`,
                                    borderRadius: 2,
                                    color: active ? "#fff" : "rgba(24,45,64,0.45)",
                                    fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                                 }}>
                                    {n === "" ? "∞" : `${n}+`}
                                 </button>
                              )
                           })}
                        </div>
                     </div>

                     {/* Price range */}
                     <div>
                        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(24,45,64,0.4)", marginBottom: 8 }}>
                           {L("Rango de precio", "Price range")}
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                           <input type="number" placeholder="Min" value={filters.minPrice}
                              onChange={e => handleFilter("minPrice", e.target.value)}
                              style={{ ...inputStyle, width: 110 }} />
                           <span style={{ color: "rgba(24,45,64,0.25)", fontSize: 12 }}>—</span>
                           <input type="number" placeholder="Max" value={filters.maxPrice}
                              onChange={e => handleFilter("maxPrice", e.target.value)}
                              style={{ ...inputStyle, width: 110 }} />
                        </div>
                     </div>

                     {/* Clear */}
                     {activeFilterCount > 0 && (
                        <button onClick={resetFilters} style={{
                           display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
                           background: "transparent",
                           border: "1px solid rgba(239,68,68,0.25)",
                           borderRadius: 2, color: "rgba(239,68,68,0.6)",
                           fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                           cursor: "pointer", transition: "all 0.2s",
                        }}
                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLElement).style.color = "#EF4444" }}
                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.25)"; (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.6)" }}
                        >
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                           {L("Limpiar", "Clear")}
                        </button>
                     )}
                  </div>
               )}
            </div>
         </div>

         {/* ── GRID ─────────────────────────────────────────────── */}
         <div className="container" style={{ paddingTop: 48, paddingBottom: 100 }}>

            {/* Count */}
            {!loading && (
               <div style={{ marginBottom: 28, fontSize: 13, color: "rgba(24,45,64,0.4)" }}>
                  {total === 0 ? L("Sin resultados", "No results") : (
                     <>{L("Mostrando", "Showing")}{" "}
                        <span style={{ color: "#182D40", fontWeight: 700 }}>{start}–{end}</span>{" "}
                        {L("de", "of")}{" "}
                        <span style={{ color: "#182D40", fontWeight: 700 }}>{total}</span>{" "}
                        {L("propiedades", "properties")}
                     </>
                  )}
               </div>
            )}

            {/* Empty */}
            {!loading && properties.length === 0 && (
               <div style={{ textAlign: "center", padding: "100px 0" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(24,45,64,0.12)" strokeWidth="1" style={{ display: "block", margin: "0 auto 20px" }}>
                     <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <p style={{ color: "rgba(24,45,64,0.3)", fontSize: 14, letterSpacing: "0.05em" }}>
                     {L("No hay propiedades con esos filtros.", "No properties match your filters.")}
                  </p>
                  <button onClick={resetFilters} style={{
                     marginTop: 16, background: "transparent",
                     border: "1px solid rgba(24,45,64,0.15)", color: "rgba(24,45,64,0.5)",
                     padding: "10px 24px", borderRadius: 2, fontSize: 12, fontWeight: 700,
                     letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
                  }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#182D40"; (e.currentTarget as HTMLElement).style.color = "#fff" }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(24,45,64,0.5)" }}
                  >
                     {L("Ver todas", "View all")}
                  </button>
               </div>
            )}

            {/* Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
               {loading
                  ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
                  : properties.map(p => <PropertyCard key={p.id} p={p} lang={lang} />)
               }
            </div>

            {/* Pagination */}
            {totalPages > 1 && !loading && (
               <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, paddingTop: 64 }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{
                     width: 40, height: 40, background: "transparent",
                     border: "1px solid rgba(24,45,64,0.12)", borderRadius: 2,
                     color: currentPage === 1 ? "rgba(24,45,64,0.2)" : "rgba(24,45,64,0.5)",
                     cursor: currentPage === 1 ? "not-allowed" : "pointer",
                     display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                  }}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                     <button key={n} onClick={() => setCurrentPage(n)} style={{
                        width: 40, height: 40,
                        background: n === currentPage ? "#182D40" : "#fff",
                        border: `1px solid ${n === currentPage ? "#182D40" : "rgba(24,45,64,0.12)"}`,
                        borderRadius: 2,
                        color: n === currentPage ? "#fff" : "rgba(24,45,64,0.5)",
                        fontWeight: n === currentPage ? 700 : 400,
                        fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                     }}>
                        {n}
                     </button>
                  ))}

                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{
                     width: 40, height: 40, background: "transparent",
                     border: "1px solid rgba(24,45,64,0.12)", borderRadius: 2,
                     color: currentPage === totalPages ? "rgba(24,45,64,0.2)" : "rgba(24,45,64,0.5)",
                     cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                     display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                  }}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
               </div>
            )}
         </div>

         <style>{`
            @keyframes nubia-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            select option { background: #fff; color: #182D40; }
            input[type="text"]::placeholder, input[type="number"]::placeholder { color: rgba(24,45,64,0.3); }
            input[type="text"]:focus, input[type="number"]:focus, select:focus { border-color: rgba(24,45,64,0.3) !important; outline: none; box-shadow: 0 0 0 3px rgba(24,45,64,0.06); }
         `}</style>
      </div>
   )
}

export default ListingSevenArea
