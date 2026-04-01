import Image from "next/image"
import Link from "next/link"

import featureImg1 from "@/assets/images/media/img_45.jpg"
import featureImg2 from "@/assets/images/media/img_46.jpg"

const NubiaFeatures = () => {
   return (
      <>
         {/* ── Block 1: Crédito Hipotecario — Sage bg ── */}
         <div className="nubia-feature-block sage py-130 xl-py-100">
            <div className="container">
               <div className="row align-items-center g-5">
                  <div className="col-lg-6">
                     <div className="feature-image-wrap wow fadeInLeft">
                        <Image
                           src={featureImg1}
                           alt="Crédito Hipotecario"
                           width={700}
                           height={520}
                           style={{ objectFit: "cover", width: "100%", height: "auto" }}
                        />
                     </div>
                  </div>
                  <div className="col-lg-5 offset-lg-1">
                     <div className="wow fadeInRight">
                        <div className="feature-tag">Financiamiento</div>
                        <h2 className="feature-heading color-dark mb-30">
                           Crédito<br />
                           Hipotecario
                        </h2>

                        <div className="d-flex gap-4 mb-40">
                           <div className="feature-rate" style={{ borderRight: "1px solid rgba(0,0,0,0.1)", paddingRight: "32px" }}>
                              <div className="rate-number color-dark">9.5%</div>
                              <div className="rate-label" style={{ color: "rgba(0,0,0,0.4)" }}>Tasa Anual</div>
                           </div>
                           <div className="feature-rate" style={{ paddingLeft: "8px" }}>
                              <div className="rate-number color-dark">30</div>
                              <div className="rate-label" style={{ color: "rgba(0,0,0,0.4)" }}>Años plazo</div>
                           </div>
                        </div>

                        <p className="feature-body" style={{ color: "rgba(0,0,0,0.55)", marginBottom: "40px" }}>
                           Te acompañamos en todo el proceso de financiamiento.
                           Trabajamos con los principales bancos para conseguirte
                           las mejores tasas y condiciones del mercado.
                        </p>

                        <Link href="/contact" className="feature-link dark-link">
                           Solicitar Asesoría
                           <i className="bi bi-arrow-up-right"></i>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* ── Marquee strip ── */}
         <div className="nubia-marquee-strip">
            <div className="marquee-inner">
               {[...Array(8)].map((_, i) => (
                  <span key={i} className="marquee-item">
                     Casas <span className="sep">·</span>
                     Departamentos <span className="sep">·</span>
                     Terrenos <span className="sep">·</span>
                     Locales Comerciales <span className="sep">·</span>
                     Oficinas <span className="sep">·</span>
                     Inversión <span className="sep">·</span>
                  </span>
               ))}
            </div>
         </div>

         {/* ── Block 2: Inversión — Dark bg ── */}
         <div className="nubia-feature-block dark py-130 xl-py-100">
            <div className="container">
               <div className="row align-items-center g-5">
                  <div className="col-lg-5">
                     <div className="wow fadeInLeft">
                        <div className="feature-tag" style={{ color: "#D9A76A" }}>Inversión</div>
                        <h2
                           className="feature-heading mb-30"
                           style={{ color: "#fff" }}
                        >
                           Inversión<br />
                           Inteligente
                        </h2>

                        <p className="feature-body mb-40" style={{ color: "rgba(255,255,255,0.5)" }}>
                           Nuestros asesores de inversión identifican las mejores
                           oportunidades del mercado inmobiliario mexicano para
                           maximizar tu rendimiento a corto, mediano y largo plazo.
                        </p>

                        <div className="d-flex gap-4 mb-50">
                           <div>
                              <div
                                 className="feature-rate"
                                 style={{ borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: "32px" }}
                              >
                                 <div className="rate-number" style={{ color: "#D9A76A" }}>12%</div>
                                 <div className="rate-label" style={{ color: "rgba(255,255,255,0.35)" }}>ROI Promedio</div>
                              </div>
                           </div>
                           <div>
                              <div className="feature-rate" style={{ paddingLeft: "8px" }}>
                                 <div className="rate-number" style={{ color: "#fff" }}>200+</div>
                                 <div className="rate-label" style={{ color: "rgba(255,255,255,0.35)" }}>Inversores Activos</div>
                              </div>
                           </div>
                        </div>

                        <Link href="/listing_07" className="feature-link light">
                           Ver Oportunidades
                           <i className="bi bi-arrow-up-right"></i>
                        </Link>
                     </div>
                  </div>
                  <div className="col-lg-6 offset-lg-1">
                     <div className="feature-image-wrap wow fadeInRight">
                        <Image
                           src={featureImg2}
                           alt="Inversión Inmobiliaria"
                           width={700}
                           height={520}
                           style={{ objectFit: "cover", width: "100%", height: "auto" }}
                        />
                     </div>
                     {/* Watermark number */}
                     <span className="feature-big-number" aria-hidden>INV</span>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default NubiaFeatures
