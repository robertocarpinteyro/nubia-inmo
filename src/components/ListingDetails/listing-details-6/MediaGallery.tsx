"use client"
import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/context/LanguageContext"

interface MediaItem {
   id: number
   url: string
   mediaType: string
   sortOrder: number
   title?: string
}

interface Props {
   media: MediaItem[]
}

const MediaGallery = ({ media }: Props) => {
   const { lang } = useLanguage()
   const images = media
      .filter(m => m.mediaType === "image")
      .sort((a, b) => a.sortOrder - b.sortOrder)

   const [current, setCurrent] = useState(0)
   const [transitioning, setTransitioning] = useState(false)
   const [hovered, setHovered] = useState(false)
   const [lightbox, setLightbox] = useState(false)
   const [kenKey, setKenKey] = useState(0)

   const goTo = useCallback((idx: number) => {
      if (transitioning || idx === current) return
      setTransitioning(true)
      setTimeout(() => {
         setCurrent(idx)
         setKenKey(k => k + 1)
         setTransitioning(false)
      }, 600)
   }, [current, transitioning])

   const goNext = useCallback(() => goTo((current + 1) % images.length), [current, images.length, goTo])
   const goPrev = useCallback(() => goTo((current - 1 + images.length) % images.length), [current, images.length, goTo])

   useEffect(() => {
      if (!lightbox) return
      const handler = (e: KeyboardEvent) => {
         if (e.key === "ArrowRight") goNext()
         if (e.key === "ArrowLeft") goPrev()
         if (e.key === "Escape") setLightbox(false)
      }
      window.addEventListener("keydown", handler)
      return () => window.removeEventListener("keydown", handler)
   }, [lightbox, goNext, goPrev])

   useEffect(() => {
      document.body.style.overflow = lightbox ? "hidden" : ""
      return () => { document.body.style.overflow = "" }
   }, [lightbox])

   if (images.length === 0) {
      return (
         <div style={{ height: 480, background: "#F0EFE9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "rgba(24,45,64,0.22)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
               {lang === "en" ? "No images available" : "Sin imágenes"}
            </span>
         </div>
      )
   }

   const pad = (n: number) => String(n).padStart(2, "0")

   return (
      <>
         {/* ── Main stage ─────────────────────────────── */}
         <div
            style={{ position: "relative", width: "100%", aspectRatio: "16/9", maxHeight: 580, overflow: "hidden", background: "#0a0a0a", cursor: "pointer" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setLightbox(true)}
         >
            {/* Outgoing image — fades out */}
            {transitioning && (
               <div style={{ position: "absolute", inset: 0, zIndex: 2, opacity: 0, transition: "opacity 0.6s ease" }}>
                  <img
                     src={images[current].url}
                     alt=""
                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
               </div>
            )}

            {/* Active image — Ken Burns */}
            <div key={kenKey} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
               <img
                  src={images[current].url}
                  alt={images[current].title || ""}
                  style={{
                     width: "100%", height: "100%", objectFit: "cover",
                     animation: "mgKenBurns 9s ease-out forwards",
                  }}
               />
            </div>

            {/* Gradient vignette */}
            <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: "linear-gradient(to top, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.1) 40%, transparent 70%)" }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: "linear-gradient(to right, rgba(10,10,10,0.25) 0%, transparent 30%)" }} />

            {/* Counter — bottom left */}
            <div style={{ position: "absolute", bottom: 22, left: 26, zIndex: 5, display: "flex", alignItems: "baseline", gap: 4 }}>
               <span style={{ color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Gordita, sans-serif" }}>{pad(current + 1)}</span>
               <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, letterSpacing: "0.08em" }}>/ {pad(images.length)}</span>
            </div>

            {/* Title — bottom center */}
            {images[current].title && (
               <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 5, color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {images[current].title}
               </div>
            )}

            {/* "Ver todas" — bottom right */}
            <div style={{ position: "absolute", bottom: 22, right: 22, zIndex: 5, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.09)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 2, padding: "7px 14px", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }}>
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
               {lang === "en" ? `All photos` : `Ver galería`}
            </div>

            {/* Prev arrow */}
            {images.length > 1 && (
               <button
                  onClick={e => { e.stopPropagation(); goPrev() }}
                  style={{ position: "absolute", left: 18, top: "50%", transform: `translateY(-50%) translateX(${hovered ? 0 : -8}px)`, zIndex: 5, width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(10,10,10,0.4)", backdropFilter: "blur(6px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease, transform 0.35s ease" }}
               >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6"/></svg>
               </button>
            )}

            {/* Next arrow */}
            {images.length > 1 && (
               <button
                  onClick={e => { e.stopPropagation(); goNext() }}
                  style={{ position: "absolute", right: 18, top: "50%", transform: `translateY(-50%) translateX(${hovered ? 0 : 8}px)`, zIndex: 5, width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(10,10,10,0.4)", backdropFilter: "blur(6px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease, transform 0.35s ease" }}
               >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
               </button>
            )}

            {/* Progress bar */}
            {images.length > 1 && (
               <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5, height: 2, background: "rgba(255,255,255,0.1)" }}>
                  <div style={{ height: "100%", background: "#D9A76A", width: `${((current + 1) / images.length) * 100}%`, transition: "width 0.6s ease" }} />
               </div>
            )}
         </div>

         {/* ── Thumbnail strip ─────────────────────────── */}
         {images.length > 1 && (
            <div style={{ display: "flex", gap: 4, paddingTop: 6, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
               {images.map((img, i) => (
                  <button
                     key={img.id}
                     onClick={() => goTo(i)}
                     style={{
                        flexShrink: 0, width: 68, height: 46, padding: 0, cursor: "pointer",
                        border: "none", borderRadius: 2, overflow: "hidden",
                        outline: i === current ? "2px solid #D9A76A" : "2px solid transparent",
                        outlineOffset: 1,
                        opacity: i === current ? 1 : 0.42,
                        transition: "opacity 0.3s, outline-color 0.3s",
                     }}
                  >
                     <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
               ))}
            </div>
         )}

         {/* ── Keyframes ──────────────────────────────── */}
         <style>{`
            @keyframes mgKenBurns {
               0%   { transform: scale(1)    translateX(0px)   translateY(0px); }
               100% { transform: scale(1.07) translateX(-12px) translateY(-6px); }
            }
         `}</style>

         {/* ── Lightbox ───────────────────────────────── */}
         {lightbox && (
            <div
               onClick={() => setLightbox(false)}
               style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(4,4,4,0.97)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
               <img
                  src={images[current].url}
                  alt=""
                  onClick={e => e.stopPropagation()}
                  style={{ maxWidth: "92vw", maxHeight: "88vh", objectFit: "contain", display: "block", borderRadius: 2 }}
               />

               {/* Close */}
               <button onClick={() => setLightbox(false)} style={{ position: "fixed", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
               </button>

               {images.length > 1 && (
                  <button onClick={e => { e.stopPropagation(); goPrev() }} style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
               )}

               {images.length > 1 && (
                  <button onClick={e => { e.stopPropagation(); goNext() }} style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
               )}

               {/* Thumbnails strip — lightbox */}
               <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, alignItems: "center" }} onClick={e => e.stopPropagation()}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.15em", marginRight: 10 }}>{pad(current + 1)} / {pad(images.length)}</span>
                  {images.map((img, i) => (
                     <button
                        key={img.id}
                        onClick={() => goTo(i)}
                        style={{ flexShrink: 0, width: 52, height: 36, padding: 0, border: "none", borderRadius: 2, overflow: "hidden", outline: i === current ? "2px solid #D9A76A" : "2px solid transparent", outlineOffset: 1, opacity: i === current ? 1 : 0.35, cursor: "pointer", transition: "all 0.25s" }}
                     >
                        <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                     </button>
                  ))}
               </div>
            </div>
         )}
      </>
   )
}

export default MediaGallery
