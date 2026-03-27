import Link from "next/link"

const steps = [
   {
      num: "01",
      title: "Define tu Búsqueda",
      body: "Cuéntanos qué tipo de propiedad necesitas, tu presupuesto, ubicación y características clave. Nuestros asesores escuchan y entienden.",
   },
   {
      num: "02",
      title: "Selección Personalizada",
      body: "Filtramos nuestro portafolio y la red de propiedades en México para presentarte solo las opciones que realmente encajan con tu perfil.",
   },
   {
      num: "03",
      title: "Visitas y Due Diligence",
      body: "Coordinamos visitas presenciales o virtuales. Verificamos documentación, situación legal y estado físico de cada inmueble.",
   },
   {
      num: "04",
      title: "Cierre y Escrituración",
      body: "Acompañamos el proceso notarial, financiamiento y entrega de llaves. Tu inversión protegida en cada paso.",
   },
]

const NubiaProcess = () => {
   return (
      <div className="nubia-process py-130 xl-py-100">
         <div className="container">
            <div className="row g-5">
               {/* Steps */}
               <div className="col-lg-7">
                  <span className="section-label" style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(12,12,12,0.35)", marginBottom: "20px", display: "block" }}>
                     Proceso
                  </span>
                  <h2
                     className="mb-60"
                     style={{ fontSize: "clamp(2rem, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.92, textTransform: "uppercase", color: "#0C0C0C" }}
                  >
                     Cómo<br />Trabajamos
                  </h2>

                  {steps.map((step) => (
                     <div key={step.num} className="process-step">
                        <div className="step-number">{step.num}</div>
                        <div>
                           <div className="step-title">{step.title}</div>
                           <p className="step-body">{step.body}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* CTA Card */}
               <div className="col-lg-5">
                  <div className="process-cta-card">
                     <div>
                        <h3 className="cta-heading mb-24">
                           ¿Listo para<br />Encontrar tu<br />Hogar?
                        </h3>
                        <p className="cta-body">
                           Agenda una consulta gratuita con uno de nuestros
                           asesores. Sin compromiso, con toda la información
                           que necesitas.
                        </p>
                     </div>
                     <div className="mt-40">
                        <Link href="/contact" className="btn-cta-white">
                           Agendar Consulta
                           <i className="bi bi-arrow-up-right ms-2"></i>
                        </Link>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "16px", marginBottom: 0 }}>
                           Respuesta en menos de 24 hrs · Sin costo
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default NubiaProcess
