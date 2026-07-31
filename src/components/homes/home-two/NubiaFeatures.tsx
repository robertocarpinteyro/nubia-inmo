// Tira/marquee de tipos de propiedad que sirve de transición entre secciones.
// (Los bloques de "Crédito Hipotecario" e "Inversión Inteligente" se retiraron:
//  aún no contamos con financiera aliada ni con las métricas que mostraban.)
const NubiaFeatures = () => {
   return (
      <div className="nubia-marquee-strip">
         <div className="marquee-inner">
            {[...Array(8)].map((_, i) => (
               <span key={i} className="marquee-item">
                  Casas <span className="sep">·</span>
                  Departamentos <span className="sep">·</span>
                  Terrenos <span className="sep">·</span>
                  Locales Comerciales <span className="sep">·</span>
                  Oficinas <span className="sep">·</span>
               </span>
            ))}
         </div>
      </div>
   )
}

export default NubiaFeatures
