"use client"
import { useState } from "react"

const testimonials = [
   {
      quote: "NUBIA transformó por completo nuestra búsqueda de hogar. En menos de 3 semanas encontramos la casa perfecta en Monterrey. Su asesoría fue clara, honesta y sin presiones.",
      name: "María Fernanda Ríos",
      role: "Directora de Operaciones",
      location: "Monterrey, NL",
      initials: "MF",
      rating: 5,
      tag: "Compra residencial",
   },
   {
      quote: "El proceso fue impecable de principio a fin. El equipo de NUBIA conoce el mercado como nadie. Vendimos nuestra propiedad en San Pedro en tiempo récord y al mejor precio.",
      name: "Carlos Mendoza",
      role: "Empresario",
      location: "San Pedro Garza García, NL",
      initials: "CM",
      rating: 5,
      tag: "Venta de propiedad",
   },
   {
      quote: "Buscaba inversión en propiedades comerciales y NUBIA me presentó opciones que ninguna otra inmobiliaria tenía. Su análisis de rentabilidad fue clave para mi decisión.",
      name: "Sofía Castillo",
      role: "Inversionista",
      location: "Ciudad de México",
      initials: "SC",
      rating: 5,
      tag: "Inversión comercial",
   },
]

const avatarColors = ["#7B4FFF", "#4F8BFF", "#FF4F7B"]

const Stars = ({ count }: { count: number }) => (
   <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
         <svg key={i} width="13" height="13" viewBox="0 0 24 24"
            fill={i < count ? "#FFD700" : "none"}
            stroke={i < count ? "#FFD700" : "rgba(255,255,255,0.15)"}
            strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
         </svg>
      ))}
   </div>
)

const NubiaTestimonial = () => {
   const [active, setActive] = useState(0)

   return (
      <div className="nubia-testimonial" style={{ padding: "100px 0", background: "#0C0C0C", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
         <div className="container">

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 20 }}>
               <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                     Testimonios
                  </div>
                  <h2 style={{
                     fontFamily: "Gordita, sans-serif",
                     fontWeight: 900,
                     fontSize: "clamp(2rem, 4vw, 52px)",
                     color: "#F5F5F2",
                     letterSpacing: "-0.04em",
                     lineHeight: 1,
                     margin: 0,
                  }}>
                     Lo que dicen<br />
                     <span style={{ color: "#7B4FFF" }}>nuestros clientes</span>
                  </h2>
               </div>
               {/* Dots nav */}
               <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
                  {testimonials.map((_, i) => (
                     <button
                        key={i}
                        onClick={() => setActive(i)}
                        style={{
                           width: active === i ? 28 : 8,
                           height: 8,
                           borderRadius: 4,
                           background: active === i ? "#7B4FFF" : "rgba(255,255,255,0.15)",
                           border: "none",
                           cursor: "pointer",
                           padding: 0,
                           transition: "all 0.3s",
                        }}
                     />
                  ))}
               </div>
            </div>

            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
               {testimonials.map((t, i) => (
                  <div
                     key={i}
                     onClick={() => setActive(i)}
                     style={{
                        background: active === i ? "#111111" : "#0E0E0E",
                        border: `1px solid ${active === i ? "rgba(123,79,255,0.35)" : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 4,
                        padding: "32px 28px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        transform: active === i ? "translateY(-4px)" : "translateY(0)",
                        boxShadow: active === i ? "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(123,79,255,0.15)" : "none",
                        position: "relative",
                        overflow: "hidden",
                     }}
                  >
                     {/* Comilla decorativa */}
                     <div style={{
                        position: "absolute",
                        top: 20,
                        right: 24,
                        fontFamily: "Georgia, serif",
                        fontSize: 80,
                        lineHeight: 1,
                        color: active === i ? "rgba(123,79,255,0.15)" : "rgba(255,255,255,0.04)",
                        userSelect: "none",
                        transition: "color 0.3s",
                     }}>
                        &ldquo;
                     </div>

                     {/* Tag */}
                     <div style={{
                        display: "inline-block",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: active === i ? "#9D7AFF" : "rgba(255,255,255,0.25)",
                        background: active === i ? "rgba(123,79,255,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${active === i ? "rgba(123,79,255,0.25)" : "rgba(255,255,255,0.07)"}`,
                        borderRadius: 2,
                        padding: "4px 10px",
                        marginBottom: 20,
                        transition: "all 0.3s",
                     }}>
                        {t.tag}
                     </div>

                     {/* Stars */}
                     <div style={{ marginBottom: 16 }}>
                        <Stars count={t.rating} />
                     </div>

                     {/* Quote */}
                     <p style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: active === i ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)",
                        margin: "0 0 28px",
                        transition: "color 0.3s",
                        fontStyle: "italic",
                     }}>
                        &ldquo;{t.quote}&rdquo;
                     </p>

                     {/* Author */}
                     <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                        <div style={{
                           width: 40,
                           height: 40,
                           borderRadius: "50%",
                           background: active === i ? avatarColors[i] : "rgba(255,255,255,0.06)",
                           border: `2px solid ${active === i ? avatarColors[i] : "rgba(255,255,255,0.08)"}`,
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           fontSize: 13,
                           fontWeight: 700,
                           color: "#fff",
                           flexShrink: 0,
                           transition: "all 0.3s",
                        }}>
                           {t.initials}
                        </div>
                        <div>
                           <div style={{ fontSize: 13, fontWeight: 700, color: active === i ? "#F5F5F2" : "rgba(255,255,255,0.45)", transition: "color 0.3s" }}>
                              {t.name}
                           </div>
                           <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
                              {t.role} · {t.location}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

         </div>
      </div>
   )
}

export default NubiaTestimonial
