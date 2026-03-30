"use client"
import { useState, useEffect, useRef, useCallback, Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Combobox, Transition } from "@headlessui/react"
import { API_BASE_URL } from "@/context/AuthContext"

import bannerImg from "@/assets/images/assets/ils_03.png"

interface Suggestion {
   id: number
   title: string
   city: string | null
   state: string | null
   propertyType: string
   transactionType: string
   price: number
   currency: string
}

const formatPrice = (price: number, currency: string) =>
   new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

const typeLabel: Record<string, string> = {
   casa: "Casa", departamento: "Depto", terreno: "Terreno", oficina: "Oficina", local: "Local",
}
const txLabel: Record<string, string> = { venta: "Venta", renta: "Renta" }

const HeroBanner = () => {
   const router = useRouter()
   const [query, setQuery] = useState("")
   const [selected, setSelected] = useState<Suggestion | null>(null)
   const [suggestions, setSuggestions] = useState<Suggestion[]>([])
   const [loading, setLoading] = useState(false)
   const [propertyType, setPropertyType] = useState("")
   const [transactionType, setTransactionType] = useState("")
   const debounceRef = useRef<NodeJS.Timeout | null>(null)

   const fetchSuggestions = useCallback(async (q: string) => {
      if (q.length < 2) { setSuggestions([]); return }
      setLoading(true)
      try {
         const res = await fetch(`${API_BASE_URL}/properties/autocomplete?q=${encodeURIComponent(q)}`)
         const data = await res.json()
         setSuggestions(data.suggestions || [])
      } catch {
         setSuggestions([])
      } finally {
         setLoading(false)
      }
   }, [])

   const handleQueryChange = (val: string) => {
      setQuery(val)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => fetchSuggestions(val), 280)
   }

   // Cuando el usuario selecciona del dropdown → navegar directo
   const handleSelect = (item: Suggestion | null) => {
      if (!item) return
      setSelected(item)
      setQuery(item.title)
      navigateToListing(item.title)
   }

   const navigateToListing = (q: string) => {
      const params = new URLSearchParams()
      if (q) params.set("search", q)
      if (propertyType) params.set("propertyType", propertyType)
      if (transactionType) params.set("transactionType", transactionType)
      router.push(`/listing_07?${params.toString()}`)
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      navigateToListing(query)
   }

   return (
      <div className="nubia-hero">
         <div className="container">
            <div className="hero-inner">
               <div className="row align-items-center">
                  <div className="col-lg-6 col-xl-5">
                     <div className="hero-badge wow fadeInUp">
                        <span className="dot"></span>
                        Inmobiliaria Premium · México
                     </div>
                     <h1 className="nubia-hero-heading wow fadeInUp" data-wow-delay="0.05s">
                        <span className="d-block">Abriendo</span>
                        <span className="d-block accent-line">Nuevas</span>
                        <span className="d-block outline-line">Puertas</span>
                     </h1>
                     <p className="hero-subtitle mt-40 mb-45 wow fadeInUp" data-wow-delay="0.1s">
                        Conectamos personas con el hogar de sus sueños en México.
                        Propiedades residenciales, comerciales e inversión.
                     </p>
                     <div className="hero-cta-group wow fadeInUp" data-wow-delay="0.15s">
                        <Link href="/listing_07" className="btn-nubia-primary">
                           Explorar Propiedades
                           <i className="bi bi-arrow-up-right"></i>
                        </Link>
                        <Link href="/contact" className="btn-nubia-ghost">
                           <i className="bi bi-telephone"></i>
                           Contáctanos
                        </Link>
                     </div>
                  </div>
                  <div className="col-lg-6 col-xl-7 d-none d-lg-block" />
               </div>

               {/* ── SEARCH STRIP ── */}
               <div className="row mt-80 md-mt-50 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="col-12">
                     <form onSubmit={handleSubmit}>
                        <div className="nubia-search-strip">
                           <div className="search-inner">

                              {/* ── Combobox (headlessui) ── */}
                              <Combobox value={selected} onChange={handleSelect} nullable>
                                 <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
                                    {/* Icono lupa */}
                                    <svg
                                       style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none", zIndex: 1 }}
                                       width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    >
                                       <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>

                                    {/* Spinner */}
                                    {loading && (
                                       <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
                                          <div style={{
                                             width: 14, height: 14,
                                             border: "2px solid rgba(123,79,255,0.3)",
                                             borderTopColor: "#7B4FFF",
                                             borderRadius: "50%",
                                             animation: "nubia-spin 0.7s linear infinite",
                                          }} />
                                       </div>
                                    )}

                                    <Combobox.Input
                                       className="search-field"
                                       style={{ paddingLeft: 46, borderRight: "1px solid rgba(255,255,255,0.07)", width: "100%" }}
                                       placeholder="Buscar por colonia, municipio o ciudad..."
                                       displayValue={(item: Suggestion | null) => item ? item.title : query}
                                       onChange={e => handleQueryChange(e.target.value)}
                                       autoComplete="off"
                                    />

                                    {/* Dropdown */}
                                    <Transition
                                       as={Fragment}
                                       leave="transition ease-in duration-100"
                                       leaveFrom="opacity-100"
                                       leaveTo="opacity-0"
                                       afterLeave={() => { if (!selected) setSuggestions([]) }}
                                    >
                                       <Combobox.Options style={{
                                          position: "absolute",
                                          top: "calc(100% + 8px)",
                                          left: -1,
                                          right: -1,
                                          background: "#111111",
                                          border: "1px solid rgba(255,255,255,0.1)",
                                          borderRadius: 4,
                                          overflow: "hidden",
                                          zIndex: 9999,
                                          boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(123,79,255,0.15)",
                                          listStyle: "none",
                                          margin: 0,
                                          padding: 0,
                                       }}>
                                          {suggestions.length === 0 && query.length >= 2 && !loading ? (
                                             <li style={{ padding: "16px 20px", fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                                                Sin resultados para &ldquo;{query}&rdquo;
                                             </li>
                                          ) : (
                                             suggestions.map((s) => (
                                                <Combobox.Option key={s.id} value={s} as={Fragment}>
                                                   {({ active }) => (
                                                      <li style={{
                                                         display: "flex",
                                                         alignItems: "center",
                                                         gap: 14,
                                                         padding: "13px 18px",
                                                         background: active ? "rgba(123,79,255,0.12)" : "transparent",
                                                         borderBottom: "1px solid rgba(255,255,255,0.05)",
                                                         cursor: "pointer",
                                                         transition: "background 0.12s",
                                                      }}>
                                                         {/* Icono propiedad */}
                                                         <div style={{
                                                            width: 36, height: 36, borderRadius: 3, flexShrink: 0,
                                                            background: active ? "rgba(123,79,255,0.2)" : "rgba(123,79,255,0.08)",
                                                            border: `1px solid ${active ? "rgba(123,79,255,0.4)" : "rgba(123,79,255,0.15)"}`,
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            transition: "all 0.12s",
                                                         }}>
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9D7AFF" strokeWidth="1.5">
                                                               <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                               <polyline points="9 22 9 12 15 12 15 22" />
                                                            </svg>
                                                         </div>

                                                         {/* Texto */}
                                                         <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: 14, fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                               {s.title}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                                                               {(s.city || s.state) && (
                                                                  <>
                                                                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                                     {[s.city, s.state].filter(Boolean).join(", ")}
                                                                     <span style={{ opacity: 0.4 }}>·</span>
                                                                  </>
                                                               )}
                                                               <span>{typeLabel[s.propertyType] || s.propertyType}</span>
                                                               <span style={{ opacity: 0.4 }}>·</span>
                                                               <span>{txLabel[s.transactionType] || s.transactionType}</span>
                                                            </div>
                                                         </div>

                                                         {/* Precio */}
                                                         <div style={{ fontSize: 14, fontWeight: 700, color: active ? "#9D7AFF" : "#7B4FFF", flexShrink: 0, letterSpacing: "-0.02em" }}>
                                                            {formatPrice(Number(s.price), s.currency || "MXN")}
                                                         </div>
                                                      </li>
                                                   )}
                                                </Combobox.Option>
                                             ))
                                          )}
                                       </Combobox.Options>
                                    </Transition>
                                 </div>
                              </Combobox>

                              {/* Tipo */}
                              <select
                                 className="search-select"
                                 value={propertyType}
                                 onChange={e => setPropertyType(e.target.value)}
                              >
                                 <option value="">Tipo</option>
                                 <option value="casa">Casa</option>
                                 <option value="departamento">Departamento</option>
                                 <option value="terreno">Terreno</option>
                                 <option value="oficina">Oficina</option>
                                 <option value="local">Comercial</option>
                              </select>

                              {/* Operación */}
                              <select
                                 className="search-select"
                                 value={transactionType}
                                 onChange={e => setTransactionType(e.target.value)}
                              >
                                 <option value="">Operación</option>
                                 <option value="venta">Venta</option>
                                 <option value="renta">Renta</option>
                              </select>

                              <button className="search-btn" type="submit">
                                 <i className="bi bi-search"></i>
                                 Buscar
                              </button>
                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>

         <Image
            src={bannerImg}
            alt="Propiedad 3D NUBIA"
            className="hero-illustration lazy-img"
            priority
         />

         <div className="hero-scroll">
            <span className="scroll-line"></span>
            <span>Scroll</span>
         </div>

         <style jsx>{`
            @keyframes nubia-spin {
               to { transform: translateY(-50%) rotate(360deg); }
            }
         `}</style>
      </div>
   )
}

export default HeroBanner
