"use client"
import { useState, useRef, useCallback, Fragment } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Combobox, Transition } from "@headlessui/react"

// ── Video de fondo del hero ──────────────────────────────────────
// Servido por Vercel (carpeta public/), NO por Supabase → no consume
// egress de Supabase. Reemplaza public/hero.mp4 con el video real
// cuando esté listo; mientras, se muestra el poster de abajo.
const HERO_VIDEO = "/hero.mp4"
const HERO_POSTER = "/assets/images/media/img_01.jpg"

interface Suggestion {
   id: string; title: string; city: string | null; state: string | null
   propertyType: string;
   transactionType: string;
   price: number;
   discountPrice?: number;
   currency: string;
}

const formatPrice = (price: number, currency: string) =>
   new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

const typeLabel: Record<string, string> = {
   casa: "Casa", departamento: "Depto", terreno: "Terreno", oficina: "Oficina", local: "Local",
}
const txLabel: Record<string, string> = { venta: "Venta", renta: "Renta" }

const HeroBanner = () => {
   const router = useRouter()

   // ── Search ───────────────────────────────────────────────────────
   const [query, setQuery]               = useState("")
   const [selected, setSelected]         = useState<Suggestion | null>(null)
   const [suggestions, setSuggestions]   = useState<Suggestion[]>([])
   const [loadingSearch, setLoadingSearch] = useState(false)
   const [propertyType, setPropertyType]   = useState("")
   const [transactionType, setTransactionType] = useState("")
   const debounceRef = useRef<NodeJS.Timeout | null>(null)

   // ── Search logic ─────────────────────────────────────────────────
   const fetchSuggestions = useCallback(async (q: string) => {
      if (q.length < 2) { setSuggestions([]); return }
      setLoadingSearch(true)
      try {
         const res = await fetch(`/api/properties?search=${encodeURIComponent(q)}&limit=6`)
         const data = await res.json()
         const mapped: Suggestion[] = (data?.properties || []).map((p: any) => ({
            id: p.propertyId,
            title: p.title,
            city: p.city ?? null,
            state: p.state ?? null,
            propertyType: p.type,
            transactionType: p.operation,
            price: p.price ?? 0,
            currency: p.currency,
         }))
         setSuggestions(mapped)
      } catch { setSuggestions([]) }
      finally { setLoadingSearch(false) }
   }, [])

   const handleQueryChange = (val: string) => {
      setQuery(val)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => fetchSuggestions(val), 280)
   }

   const navigateToListing = (q: string) => {
      const p = new URLSearchParams()
      if (q) p.set("search", q)
      if (propertyType) p.set("propertyType", propertyType)
      if (transactionType) p.set("transactionType", transactionType)
      router.push(`/listing_07?${p.toString()}`)
   }

   const handleSelect = (item: Suggestion | null) => {
      if (!item) return
      setSelected(item); setQuery(item.title); navigateToListing(item.title)
   }

   return (
      <div className="nubia-hero">

         {/* ── Video de fondo (servido por Vercel, no por Supabase) ── */}
         <video
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER}
            style={{
               position: "absolute", inset: 0, width: "100%", height: "100%",
               objectFit: "cover", display: "block", zIndex: 0, background: "#182D40",
            }}
         >
            <source src={HERO_VIDEO} type="video/mp4" />
         </video>

         {/* ── Gradient overlay ───────────────────────────────────── */}
         <div style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "linear-gradient(105deg, rgba(24,45,64,0.78) 0%, rgba(24,45,64,0.45) 55%, rgba(24,45,64,0.1) 100%)",
         }} />

         {/* ── Content ────────────────────────────────────────────── */}
         <div className="container" style={{ position: "relative", zIndex: 3 }}>
            <div className="hero-inner">
               <div className="row align-items-center">
                  <div className="col-lg-6 col-xl-5">
                     <div className="hero-badge">
                        <span className="dot"></span>
                        Inmobiliaria Premium · México
                     </div>
                     <h1 className="nubia-hero-heading">
                        <span className="d-block">Abriendo</span>
                        <span className="d-block accent-line">Nuevas</span>
                        <span className="d-block outline-line">Puertas</span>
                     </h1>
                     <p className="hero-subtitle mt-40 mb-45">
                        Conectamos personas con el hogar de sus sueños en México.
                        Propiedades residenciales, comerciales e inversión.
                     </p>
                     <div className="hero-cta-group">
                        <Link href="/listing_07" className="btn-nubia-primary">
                           Explorar Propiedades <i className="bi bi-arrow-up-right"></i>
                        </Link>
                        <Link href="/contact" className="btn-nubia-ghost">
                           <i className="bi bi-telephone"></i> Contáctanos
                        </Link>
                     </div>
                  </div>
               </div>

               {/* ── Search strip ─────────────────────────────────── */}
               <div className="row mt-80 md-mt-50">
                  <div className="col-12">
                     <form onSubmit={e => { e.preventDefault(); navigateToListing(query) }}>
                        <div className="nubia-search-strip">
                           <div className="search-inner">

                              {/* ── Campo de búsqueda ── */}
                              <Combobox value={selected} onChange={handleSelect} nullable>
                                 <div className="search-input-wrap">
                                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                       <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    {loadingSearch && (
                                       <div className="search-spinner">
                                          <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%", animation: "nubia-spin 0.7s linear infinite" }} />
                                       </div>
                                    )}
                                    <Combobox.Input className="search-field"
                                       placeholder="Buscar por colonia, municipio o ciudad..."
                                       displayValue={(item: Suggestion | null) => item ? item.title : query}
                                       onChange={e => handleQueryChange(e.target.value)}
                                       autoComplete="off"
                                    />
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
                                       afterLeave={() => { if (!selected) setSuggestions([]) }}>
                                       <Combobox.Options className="search-dropdown">
                                          {suggestions.length === 0 && query.length >= 2 && !loadingSearch ? (
                                             <li className="search-no-results">
                                                Sin resultados para &ldquo;{query}&rdquo;
                                             </li>
                                          ) : suggestions.map(s => (
                                             <Combobox.Option key={s.id} value={s} as={Fragment}>
                                                {({ active }) => (
                                                   <li className={`search-option${active ? " active" : ""}`}>
                                                      <div className={`search-option-icon${active ? " active" : ""}`}>
                                                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#D9A76A" : "#325573"} strokeWidth="1.5">
                                                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                            <polyline points="9 22 9 12 15 12 15 22" />
                                                         </svg>
                                                      </div>
                                                      <div className="search-option-info">
                                                         <div className="search-option-title">{s.title}</div>
                                                         <div className="search-option-meta">
                                                            {(s.city || s.state) && (<>
                                                               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                               {[s.city, s.state].filter(Boolean).join(", ")}
                                                               <span className="sep">·</span>
                                                            </>)}
                                                            <span>{typeLabel[s.propertyType] || s.propertyType}</span>
                                                            <span className="sep">·</span>
                                                            <span>{txLabel[s.transactionType] || s.transactionType}</span>
                                                         </div>
                                                      </div>
                                                      <div className={`search-option-price${active ? " active" : ""}`}>
                                                         {s.discountPrice && s.discountPrice > 0 ? (
                                                            <div style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
                                                               <span style={{ textDecoration: "line-through", opacity: 0.6, fontSize: "0.8em" }}>
                                                                  {formatPrice(Number(s.price), s.currency || "MXN")}
                                                               </span>
                                                               <span>{formatPrice(Number(s.discountPrice), s.currency || "MXN")}</span>
                                                            </div>
                                                         ) : (
                                                            formatPrice(Number(s.price), s.currency || "MXN")
                                                         )}
                                                      </div>
                                                   </li>
                                                )}
                                             </Combobox.Option>
                                          ))}
                                       </Combobox.Options>
                                    </Transition>
                                 </div>
                              </Combobox>

                              {/* ── Filtros + botón ── */}
                              <div className="search-filters">
                                 <div className="search-selects-row">
                                    <select className="search-select" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                                       <option value="">Tipo</option>
                                       <option value="casa">Casa</option>
                                       <option value="departamento">Departamento</option>
                                       <option value="terreno">Terreno</option>
                                       <option value="oficina">Oficina</option>
                                       <option value="local">Comercial</option>
                                    </select>
                                    <select className="search-select" value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                                       <option value="">Operación</option>
                                       <option value="venta">Venta</option>
                                       <option value="renta">Renta</option>
                                    </select>
                                 </div>
                                 <button className="search-btn" type="submit">
                                    <i className="bi bi-search"></i>
                                    <span className="search-btn-text">Buscar</span>
                                 </button>
                              </div>

                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>

         <div className="hero-scroll" style={{ zIndex: 3 }}>
            <span className="scroll-line"></span>
            <span>Scroll</span>
         </div>

         <style jsx>{`
            @keyframes nubia-spin { to { transform: translateY(-50%) rotate(360deg); } }
         `}</style>
      </div>
   )
}

export default HeroBanner
