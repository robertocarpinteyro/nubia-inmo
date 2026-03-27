import Link from "next/link"

const footerLinks = {
   propiedades: [
      { label: "Casas en Venta", href: "/listing_07" },
      { label: "Departamentos", href: "/listing_07" },
      { label: "Terrenos", href: "/listing_07" },
      { label: "Locales Comerciales", href: "/listing_07" },
      { label: "Propiedades en Renta", href: "/listing_07" },
   ],
   empresa: [
      { label: "Quiénes Somos", href: "/about_us_01" },
      { label: "Nuestro Equipo", href: "/agent" },
      { label: "Testimonios", href: "/" },
      { label: "Noticias", href: "/blog_01" },
      { label: "Trabaja con Nosotros", href: "/contact" },
   ],
   servicios: [
      { label: "Asesoría de Compra", href: "/service_01" },
      { label: "Crédito Hipotecario", href: "/service_01" },
      { label: "Inversión Inmobiliaria", href: "/service_01" },
      { label: "Valuación de Propiedades", href: "/service_01" },
      { label: "Gestión de Rentas", href: "/service_01" },
   ],
}

const NubiaFooter = () => {
   return (
      <footer
         style={{
            background: "#0C0C0C",
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
                  <Link
                     href="/"
                     style={{
                        display: "inline-block",
                        fontSize: "28px",
                        fontWeight: 900,
                        letterSpacing: "-0.05em",
                        color: "#FFFFFF",
                        textDecoration: "none",
                        marginBottom: "24px",
                     }}
                  >
                     NUBIA
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
                     15 años de experiencia. Más de 1,200 propiedades vendidas.
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
                        href="tel:+528112345678"
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", textDecoration: "none" }}
                     >
                        +52 (81) 1234-5678
                     </a>
                     <a
                        href="mailto:hola@nubia.mx"
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", textDecoration: "none" }}
                     >
                        hola@nubia.mx
                     </a>
                     <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                        Av. Insurgentes Sur 1234,<br />
                        Col. Del Valle, CDMX
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
               <div style={{ display: "flex", gap: "24px" }}>
                  {[
                     { label: "Privacidad", href: "#" },
                     { label: "Términos", href: "#" },
                     { label: "Cookies", href: "#" },
                  ].map((l) => (
                     <Link
                        key={l.label}
                        href={l.href}
                        style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                     >
                        {l.label}
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </footer>
   )
}

export default NubiaFooter
