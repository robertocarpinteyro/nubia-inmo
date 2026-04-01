"use client"
import { useState, useEffect, useRef, useCallback, Fragment } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Combobox, Transition } from "@headlessui/react"
import { API_BASE_URL } from "@/context/AuthContext"

// ── Secuencia ────────────────────────────────────────────────────
const TOTAL_FRAMES = 126
const FRAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
   `/assets/images/hero/casaSequenciaImagenes/Create_time-lapse_day_202603301452${String(i).padStart(3, "0")}.jpg`
)

interface Suggestion {
   id: number; title: string; city: string | null; state: string | null
   propertyType: string; transactionType: string; price: number; currency: string
}

const formatPrice = (price: number, currency: string) =>
   new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

const typeLabel: Record<string, string> = {
   casa: "Casa", departamento: "Depto", terreno: "Terreno", oficina: "Oficina", local: "Local",
}
const txLabel: Record<string, string> = { venta: "Venta", renta: "Renta" }

const HeroBanner = () => {
   const router = useRouter()
   const heroRef   = useRef<HTMLDivElement>(null)
   const canvasRef = useRef<HTMLCanvasElement>(null)
   const images    = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null))
   const loaded    = useRef<boolean[]>(Array(TOTAL_FRAMES).fill(false))
   const rafRef    = useRef<number | null>(null)
   const lastFrame = useRef<number>(-1)

   // ── Search ───────────────────────────────────────────────────────
   const [query, setQuery]               = useState("")
   const [selected, setSelected]         = useState<Suggestion | null>(null)
   const [suggestions, setSuggestions]   = useState<Suggestion[]>([])
   const [loadingSearch, setLoadingSearch] = useState(false)
   const [propertyType, setPropertyType]   = useState("")
   const [transactionType, setTransactionType] = useState("")
   const debounceRef = useRef<NodeJS.Timeout | null>(null)

   // ── Draw frame on canvas (object-fit cover) ──────────────────────
   const drawFrame = useCallback((img: HTMLImageElement) => {
      const c = canvasRef.current
      if (!c || !img.naturalWidth) return
      const ctx = c.getContext("2d")
      if (!ctx) return
      const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight)
      const x = (c.width  - img.naturalWidth  * scale) / 2
      const y = (c.height - img.naturalHeight * scale) / 2
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)
   }, [])

   // ── Set canvas = window size ─────────────────────────────────────
   const fitCanvas = useCallback(() => {
      const c = canvasRef.current
      if (!c) return
      const w = window.innerWidth
      const h = window.innerHeight
      if (c.width !== w || c.height !== h) {
         c.width  = w
         c.height = h
         const f = Math.max(0, lastFrame.current)
         const img = images.current[f]
         if (img && loaded.current[f]) drawFrame(img)
      }
   }, [drawFrame])

   // ── Preload all images ───────────────────────────────────────────
   useEffect(() => {
      fitCanvas()
      FRAMES.forEach((src, i) => {
         const img = new window.Image()
         img.onload = () => {
            loaded.current[i] = true
            images.current[i] = img
            // Draw frame 0 as soon as it loads
            if (i === 0) {
               fitCanvas()
               drawFrame(img)
               lastFrame.current = 0
            }
         }
         img.src = src
         images.current[i] = img
      })
   }, [drawFrame, fitCanvas])

   // ── Scroll handler ───────────────────────────────────────────────
   useEffect(() => {
      const tick = () => {
         rafRef.current = null
         const hero = heroRef.current
         if (!hero) return

         fitCanvas()

         // progress: 0 when hero top hits viewport top → 1 when hero bottom hits viewport top
         const { top, height } = hero.getBoundingClientRect()
         const progress  = Math.max(0, Math.min(1, -top / height))
         const frameIdx  = Math.round(progress * (TOTAL_FRAMES - 1))

         if (frameIdx === lastFrame.current) return
         lastFrame.current = frameIdx

         const img = images.current[frameIdx]
         if (img && loaded.current[frameIdx]) {
            drawFrame(img)
         } else {
            // Find nearest loaded frame
            for (let d = 1; d < TOTAL_FRAMES; d++) {
               const lo = frameIdx - d, hi = frameIdx + d
               if (lo >= 0 && loaded.current[lo] && images.current[lo]) { drawFrame(images.current[lo]!); break }
               if (hi < TOTAL_FRAMES && loaded.current[hi] && images.current[hi]) { drawFrame(images.current[hi]!); break }
            }
         }
      }

      const onScroll = () => {
         if (rafRef.current) return
         rafRef.current = requestAnimationFrame(tick)
      }

      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll, { passive: true })
      tick() // run once on mount
      return () => {
         window.removeEventListener("scroll", onScroll)
         window.removeEventListener("resize", onScroll)
         if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
   }, [drawFrame, fitCanvas])

   // ── Search logic ─────────────────────────────────────────────────
   const fetchSuggestions = useCallback(async (q: string) => {
      if (q.length < 2) { setSuggestions([]); return }
      setLoadingSearch(true)
      try {
         const res = await fetch(`${API_BASE_URL}/properties/autocomplete?q=${encodeURIComponent(q)}`)
         setSuggestions((await res.json()).suggestions || [])
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
      <div ref={heroRef} className="nubia-hero">

         {/* ── Canvas background ──────────────────────────────────── */}
         <canvas ref={canvasRef} style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            display: "block", zIndex: 0, background: "#182D40",
         }} />

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
                              <Combobox value={selected} onChange={handleSelect} nullable>
                                 <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
                                    <svg style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.55)", pointerEvents: "none", zIndex: 1 }}
                                       width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                       <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    {loadingSearch && (
                                       <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
                                          <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%", animation: "nubia-spin 0.7s linear infinite" }} />
                                       </div>
                                    )}
                                    <Combobox.Input className="search-field"
                                       style={{ paddingLeft: 46, borderRight: "1px solid rgba(255,255,255,0.15)", width: "100%" }}
                                       placeholder="Buscar por colonia, municipio o ciudad..."
                                       displayValue={(item: Suggestion | null) => item ? item.title : query}
                                       onChange={e => handleQueryChange(e.target.value)}
                                       autoComplete="off"
                                    />
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
                                       afterLeave={() => { if (!selected) setSuggestions([]) }}>
                                       <Combobox.Options style={{
                                          position: "absolute", top: "calc(100% + 8px)", left: -1, right: -1,
                                          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px) saturate(180%)",
                                          WebkitBackdropFilter: "blur(20px) saturate(180%)",
                                          border: "1px solid rgba(255,255,255,0.35)", borderRadius: 6, overflow: "hidden",
                                          zIndex: 9999, boxShadow: "0 16px 40px rgba(24,45,64,0.2)",
                                          listStyle: "none", margin: 0, padding: 0,
                                       }}>
                                          {suggestions.length === 0 && query.length >= 2 && !loadingSearch ? (
                                             <li style={{ padding: "16px 20px", fontSize: 13, color: "rgba(24,45,64,0.45)", textAlign: "center" }}>
                                                Sin resultados para &ldquo;{query}&rdquo;
                                             </li>
                                          ) : suggestions.map(s => (
                                             <Combobox.Option key={s.id} value={s} as={Fragment}>
                                                {({ active }) => (
                                                   <li style={{
                                                      display: "flex", alignItems: "center", gap: 14, padding: "13px 18px",
                                                      background: active ? "rgba(217,167,106,0.12)" : "transparent",
                                                      borderBottom: "1px solid rgba(24,45,64,0.06)", cursor: "pointer",
                                                   }}>
                                                      <div style={{
                                                         width: 36, height: 36, borderRadius: 3, flexShrink: 0,
                                                         background: active ? "rgba(217,167,106,0.2)" : "rgba(24,45,64,0.06)",
                                                         border: `1px solid ${active ? "rgba(217,167,106,0.4)" : "rgba(24,45,64,0.1)"}`,
                                                         display: "flex", alignItems: "center", justifyContent: "center",
                                                      }}>
                                                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#D9A76A" : "#325573"} strokeWidth="1.5">
                                                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                            <polyline points="9 22 9 12 15 12 15 22" />
                                                         </svg>
                                                      </div>
                                                      <div style={{ flex: 1, minWidth: 0 }}>
                                                         <div style={{ fontSize: 14, fontWeight: 600, color: active ? "#182D40" : "rgba(24,45,64,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {s.title}
                                                         </div>
                                                         <div style={{ fontSize: 11, color: "rgba(24,45,64,0.45)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                                                            {(s.city || s.state) && (<>
                                                               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                               {[s.city, s.state].filter(Boolean).join(", ")}
                                                               <span style={{ opacity: 0.4 }}>·</span>
                                                            </>)}
                                                            <span>{typeLabel[s.propertyType] || s.propertyType}</span>
                                                            <span style={{ opacity: 0.4 }}>·</span>
                                                            <span>{txLabel[s.transactionType] || s.transactionType}</span>
                                                         </div>
                                                      </div>
                                                      <div style={{ fontSize: 14, fontWeight: 700, color: active ? "#D9A76A" : "#325573", flexShrink: 0 }}>
                                                         {formatPrice(Number(s.price), s.currency || "MXN")}
                                                      </div>
                                                   </li>
                                                )}
                                             </Combobox.Option>
                                          ))}
                                       </Combobox.Options>
                                    </Transition>
                                 </div>
                              </Combobox>
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
                              <button className="search-btn" type="submit">
                                 <i className="bi bi-search"></i> Buscar
                              </button>
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
