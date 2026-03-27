"use client"
import Image from "next/image"
import Link from "next/link"
import DropdownTwo from "@/components/search-dropdown/home-dropdown/DropdownTwo"

import bannerImg from "@/assets/images/assets/ils_03.png"

const HeroBanner = () => {
   return (
      <div className="nubia-hero">
         <div className="container">
            <div className="hero-inner">
               <div className="row align-items-center">
                  <div className="col-lg-6 col-xl-5">
                     {/* Badge */}
                     <div className="hero-badge wow fadeInUp">
                        <span className="dot"></span>
                        Inmobiliaria Premium · México
                     </div>

                     {/* Main heading */}
                     <h1 className="nubia-hero-heading wow fadeInUp" data-wow-delay="0.05s">
                        <span className="d-block">Abriendo</span>
                        <span className="d-block accent-line">Nuevas</span>
                        <span className="d-block outline-line">Puertas</span>
                     </h1>

                     {/* Subtitle */}
                     <p className="hero-subtitle mt-40 mb-45 wow fadeInUp" data-wow-delay="0.1s">
                        Conectamos personas con el hogar de sus sueños en México.
                        Propiedades residenciales, comerciales e inversión.
                     </p>

                     {/* CTA group */}
                     <div className="hero-cta-group wow fadeInUp" data-wow-delay="0.15s">
                        <Link href="/listing_07" className="btn-nubia-primary">
                           Explorar Propiedades
                           <i className="bi bi-arrow-up-right"></i>
                        </Link>
                        <Link href="/contact" className="btn-nubia-ghost">
                           <i className="bi bi-telephone"></i>
                           Contáctanos
                        </Link>
                     </div>
                  </div>

                  {/* Illustration - visible on large screens inside flow */}
                  <div className="col-lg-6 col-xl-7 d-none d-lg-block">
                     {/* empty — illustration is absolute */}
                  </div>
               </div>

               {/* Search strip */}
               <div className="row mt-80 md-mt-50 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="col-12">
                     <div className="nubia-search-strip">
                        <div className="search-inner">
                           <input
                              type="text"
                              className="search-field"
                              placeholder="Buscar por colonia, municipio o ciudad..."
                           />
                           <select className="search-select">
                              <option value="">Tipo</option>
                              <option value="casa">Casa</option>
                              <option value="depto">Departamento</option>
                              <option value="terreno">Terreno</option>
                              <option value="comercial">Comercial</option>
                           </select>
                           <select className="search-select">
                              <option value="">Operación</option>
                              <option value="venta">Venta</option>
                              <option value="renta">Renta</option>
                           </select>
                           <button className="search-btn" type="button">
                              <i className="bi bi-search"></i>
                              Buscar
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* 3D illustration */}
         <Image
            src={bannerImg}
            alt="Propiedad 3D NUBIA"
            className="hero-illustration lazy-img"
            priority
         />

         {/* Scroll indicator */}
         <div className="hero-scroll">
            <span className="scroll-line"></span>
            <span>Scroll</span>
         </div>
      </div>
   )
}

export default HeroBanner
