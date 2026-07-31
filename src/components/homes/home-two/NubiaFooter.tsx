"use client"
import Link from "next/link"
import { useState } from "react"

const FooterLogo = () => {
   const [err, setErr] = useState(false)
   if (err) return <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.05em", color: "#fff" }}>NUBIA</span>
   return (
      <img
         src="/assets/images/logo/Nubia_Logotipo.png"
         alt="NUBIA"
         height={48}
         style={{ height: 48, width: "auto" }}
         onError={() => setErr(true)}
      />
   )
}

// Solo enlaces a páginas funcionales del sitio.
const footerLinks = {
   propiedades: [
      { label: "Ver Propiedades", href: "/listing_07" },
      { label: "Casas", href: "/listing_07" },
      { label: "Departamentos", href: "/listing_07" },
      { label: "Terrenos", href: "/listing_07" },
   ],
   empresa: [
      { label: "Inicio", href: "/" },
      { label: "Quiénes Somos", href: "/about_us_02" },
      { label: "Contacto", href: "/contact" },
   ],
}

const NubiaFooter = () => {
   return (
      <footer
         style={{
            background: "#182D40",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "100px",
            paddingBottom: "48px",
         }}
      >
         <div className="container">
            {/* Top row */}
            <div className="row g-5 mb-80">
               {/* Brand */}
               <div className="col-lg-4">
                  <Link href="/" style={{ display: "inline-block", marginBottom: "24px", textDecoration: "none" }}>
                     <FooterLogo />
                  </Link>
                  <p
                     style={{
                        fontSize: "15px",
                        color: "rgba(255,255,255,0.35)",
                        lineHeight: 1.75,
                        maxWidth: "300px",
                        marginBottom: "32px",
                     }}
                  >
                     Conectamos personas con el hogar de sus sueños en México.
                     Acompañamiento cercano y transparente en cada operación.
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                     {[
                        { icon: "instagram", href: "#" },
                        { icon: "facebook", href: "#" },
                        { icon: "twitter-x", href: "#" },
                        { icon: "linkedin", href: "#" },
                     ].map((s) => (
                        <Link
                           key={s.icon}
                           href={s.href}
                           style={{
                              width: "40px",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "2px",
                              color: "rgba(255,255,255,0.4)",
                              fontSize: "15px",
                              transition: "all 0.2s",
                              textDecoration: "none",
                           }}
                        >
                           <i className={`bi bi-${s.icon}`}></i>
                        </Link>
                     ))}
                  </div>
               </div>

               {/* Links */}
               {Object.entries(footerLinks).map(([key, links]) => (
                  <div key={key} className="col-lg-2 col-md-4">
                     <h6
                        style={{
                           fontSize: "11px",
                           fontWeight: 700,
                           letterSpacing: "0.18em",
                           textTransform: "uppercase",
                           color: "rgba(255,255,255,0.3)",
                           marginBottom: "24px",
                        }}
                     >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                     </h6>
                     <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {links.map((link) => (
                           <li key={link.label} style={{ marginBottom: "12px" }}>
                              <Link
                                 href={link.href}
                                 style={{
                                    color: "rgba(255,255,255,0.5)",
                                    textDecoration: "none",
                                    fontSize: "15px",
                                    transition: "color 0.2s",
                                 }}
                              >
                                 {link.label}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}

               {/* Contact */}
               <div className="col-lg-2 col-md-4">
                  <h6
                     style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.3)",
                        marginBottom: "24px",
                     }}
                  >
                     Contacto
                  </h6>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                     <a
                        href="tel:+528141558165"
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", textDecoration: "none" }}
                     >
                        +52 81 4155 8165
                     </a>
                     <a
                        href="mailto:hola@nubia.mx"
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", textDecoration: "none" }}
                     >
                        hola@nubia.mx
                     </a>
                     <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                        Calle Valencia 131,<br />
                        2ª Sección de La Gabriel Pastor,<br />
                        Puebla, Pue. 72425
                     </p>
                  </div>
               </div>
            </div>

            {/* Bottom row */}
            <div
               style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
               }}
            >
               <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
                  © {new Date().getFullYear()} NUBIA Inmobiliaria · Todos los derechos reservados
               </p>
            </div>
         </div>
      </footer>
   )
}

export default NubiaFooter
