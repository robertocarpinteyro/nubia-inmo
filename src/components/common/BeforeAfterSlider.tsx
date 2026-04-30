"use client"
import { useState, useRef, useCallback, useEffect } from "react"

interface Props {
   before: string   // foto real / estado actual
   after: string    // render / proyección
   labelBefore?: string
   labelAfter?: string
}

const BeforeAfterSlider = ({ before, after, labelBefore = "ACTUAL", labelAfter = "RENDER" }: Props) => {
   const [pos, setPos] = useState(50) // percentage 0–100
   const [dragging, setDragging] = useState(false)
   const containerRef = useRef<HTMLDivElement>(null)

   const calcPos = useCallback((clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const raw = ((clientX - rect.left) / rect.width) * 100
      setPos(Math.min(100, Math.max(0, raw)))
   }, [])

   const onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      setDragging(true)
   }
   const onTouchStart = () => setDragging(true)

   useEffect(() => {
      if (!dragging) return
      const onMove = (e: MouseEvent) => calcPos(e.clientX)
      const onTouchMove = (e: TouchEvent) => calcPos(e.touches[0].clientX)
      const onUp = () => setDragging(false)
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
      window.addEventListener("touchmove", onTouchMove, { passive: true })
      window.addEventListener("touchend", onUp)
      return () => {
         window.removeEventListener("mousemove", onMove)
         window.removeEventListener("mouseup", onUp)
         window.removeEventListener("touchmove", onTouchMove)
         window.removeEventListener("touchend", onUp)
      }
   }, [dragging, calcPos])

   return (
      <div
         ref={containerRef}
         style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", userSelect: "none", cursor: dragging ? "col-resize" : "ew-resize", background: "#0a0a0a" }}
         onClick={e => calcPos(e.clientX)}
      >
         {/* ── After image (full width, base layer) ── */}
         <img
            src={after}
            alt={labelAfter}
            draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
         />

         {/* ── Before image (clipped to left of slider) ── */}
         <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: `${pos}%` }}>
            <img
               src={before}
               alt={labelBefore}
               draggable={false}
               style={{ position: "absolute", inset: 0, width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100vw", maxWidth: "none", height: "100%", objectFit: "cover", display: "block" }}
            />
         </div>

         {/* ── Divider line ── */}
         <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 2, background: "rgba(255,255,255,0.9)", zIndex: 10, pointerEvents: "none" }} />

         {/* ── Drag handle ── */}
         <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
               position: "absolute", top: "50%", left: `${pos}%`,
               transform: "translate(-50%, -50%)",
               zIndex: 11, cursor: "col-resize",
               width: 44, height: 44, borderRadius: "50%",
               background: "#fff",
               boxShadow: "0 2px 16px rgba(0,0,0,0.45)",
               display: "flex", alignItems: "center", justifyContent: "center",
               transition: dragging ? "none" : "box-shadow 0.2s",
            }}
         >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#182D40" strokeWidth="2.5">
               <polyline points="9 18 3 12 9 6" /><polyline points="15 6 21 12 15 18" />
            </svg>
         </div>

         {/* ── Label Before ── */}
         <div style={{
            position: "absolute", top: 16, left: 16, zIndex: 9,
            color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
            padding: "5px 12px", borderRadius: 2,
            opacity: pos > 12 ? 1 : 0, transition: "opacity 0.25s",
         }}>
            {labelBefore}
         </div>

         {/* ── Label After ── */}
         <div style={{
            position: "absolute", top: 16, right: 16, zIndex: 9,
            color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
            background: "rgba(123,79,255,0.55)", backdropFilter: "blur(6px)",
            padding: "5px 12px", borderRadius: 2,
            opacity: pos < 88 ? 1 : 0, transition: "opacity 0.25s",
         }}>
            {labelAfter}
         </div>

         {/* ── Hint (fade out on first interaction) ── */}
         {pos === 50 && !dragging && (
            <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", zIndex: 9, color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "0.12em", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", pointerEvents: "none" }}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
               Arrastra para comparar
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
         )}
      </div>
   )
}

export default BeforeAfterSlider
