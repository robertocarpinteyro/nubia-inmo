"use client"
import Link from "next/link"
import { useState } from "react"

const NubiaCtaBanner = () => {
   const [email, setEmail] = useState("")

   return (
      <div className="nubia-cta-banner">
         <div className="container">
            <div className="row align-items-end g-5">
               <div className="col-lg-7 wow fadeInLeft">
                  <h2 className="cta-super-text">
                     ¿Tienes<br />
                     <span>alguna</span><br />
                     consulta?
                  </h2>
               </div>

               <div className="col-lg-5 wow fadeInRight">
                  <p
                     style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "32px" }}
                  >
                     Déjanos tu email y un asesor NUBIA se pondrá en contacto
                     contigo en menos de 24 horas. Sin compromiso.
                  </p>

                  <form
                     onSubmit={(e) => e.preventDefault()}
                     style={{ display: "flex", gap: 0, marginBottom: "14px" }}
                  >
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        style={{
                           flex: 1,
                           background: "#1D3347",
                           border: "1px solid rgba(255,255,255,0.1)",
                           borderRight: "none",
                           borderRadius: "2px 0 0 2px",
                           color: "#fff",
                           padding: "16px 20px",
                           fontSize: "15px",
                           outline: "none",
                        }}
                     />
                     <button
                        type="submit"
                        style={{
                           background: "#D9A76A",
                           border: "none",
                           color: "#fff",
                           fontSize: "14px",
                           fontWeight: 700,
                           letterSpacing: "0.05em",
                           textTransform: "uppercase",
                           padding: "16px 28px",
                           borderRadius: "0 2px 2px 0",
                           cursor: "pointer",
                           whiteSpace: "nowrap",
                        }}
                     >
                        Enviar
                     </button>
                  </form>

                  <p className="cta-note">
                     También puedes{" "}
                     <Link href="/contact" style={{ color: "#E8C08E", textDecoration: "underline" }}>
                        escribirnos directamente
                     </Link>
                     {" "}o llamarnos al <strong style={{ color: "rgba(255,255,255,0.5)" }}>+52 (81) 1234-5678</strong>
                  </p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default NubiaCtaBanner
