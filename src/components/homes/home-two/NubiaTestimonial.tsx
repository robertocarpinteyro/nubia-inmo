import Count from "@/components/common/Count"

const NubiaTestimonial = () => {
   return (
      <div className="nubia-testimonial py-100">
         <div className="container">
            <div className="row align-items-start g-5">
               {/* Quote */}
               <div className="col-lg-8">
                  <span
                     style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "32px" }}
                  >
                     Testimonios
                  </span>
                  <blockquote className="testimonial-quote">
                     &ldquo;NUBIA transformó por completo nuestra búsqueda de hogar.
                     En menos de 3 semanas encontramos la casa perfecta en
                     Monterrey. Su asesoría fue clara, honesta y sin presiones.
                     100% recomendados.&rdquo;
                  </blockquote>
                  <p className="testimonial-author mt-24">
                     <strong>María Fernanda Ríos</strong> — Directora de Operaciones, Monterrey NL
                  </p>
               </div>

               {/* Counters */}
               <div className="col-lg-4">
                  <div className="counter-block-nubia">
                     <div className="count-number">
                        <Count number={1200} />+
                     </div>
                     <div className="count-label">Propiedades Vendidas</div>
                  </div>
                  <div className="counter-block-nubia">
                     <div className="count-number">
                        <Count number={4800} />+
                     </div>
                     <div className="count-label">Familias Atendidas</div>
                  </div>
                  <div className="counter-block-nubia">
                     <div className="count-number">
                        <Count number={15} />
                        <span style={{ fontSize: "0.6em", letterSpacing: "0" }}>años</span>
                     </div>
                     <div className="count-label">En el Mercado</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default NubiaTestimonial
