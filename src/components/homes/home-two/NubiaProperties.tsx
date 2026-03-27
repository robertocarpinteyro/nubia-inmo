import Link from "next/link"
import Image from "next/image"

import img1 from "@/assets/images/listing/img_01.jpg"
import img2 from "@/assets/images/listing/img_02.jpg"
import img3 from "@/assets/images/listing/img_03.jpg"

const properties = [
   {
      id: 1,
      img: img1,
      tag: "Venta",
      price: "$4,800,000",
      title: "Casa Residencial con Jardín",
      location: "San Pedro Garza García, NL",
      beds: 4,
      baths: 3,
      sqft: 280,
      href: "/listing_details_01",
   },
   {
      id: 2,
      img: img2,
      tag: "Renta",
      price: "$28,000/mes",
      title: "Penthouse Vista Panorámica",
      location: "Polanco, CDMX",
      beds: 3,
      baths: 2,
      sqft: 180,
      href: "/listing_details_01",
   },
   {
      id: 3,
      img: img3,
      tag: "Venta",
      price: "$12,500,000",
      title: "Villa Privada con Alberca",
      location: "Zapopan, Jalisco",
      beds: 5,
      baths: 4,
      sqft: 420,
      href: "/listing_details_01",
   },
]

const NubiaProperties = () => {
   return (
      <div className="nubia-section-dark py-130 xl-py-100">
         <div className="container">
            {/* Section header */}
            <div className="row align-items-end mb-60">
               <div className="col-lg-8">
                  <span className="section-label">Propiedades Destacadas</span>
                  <h2 className="section-heading">
                     Nuevos<br />
                     Listados
                  </h2>
               </div>
               <div className="col-lg-4 text-lg-end">
                  <Link
                     href="/listing_07"
                     className="nubia-feature-block__link feature-link light"
                     style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                  >
                     Ver Todas
                     <i className="bi bi-arrow-up-right" style={{ display: "flex", width: "36px", height: "36px", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", borderRadius: "50%" }}></i>
                  </Link>
               </div>
            </div>

            {/* Cards */}
            <div className="row g-4">
               {properties.map((p) => (
                  <div key={p.id} className="col-lg-4 col-md-6">
                     <Link href={p.href} className="nubia-property-card d-block text-decoration-none">
                        <div className="card-thumb" style={{ position: "relative" }}>
                           <Image src={p.img} alt={p.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                           <span className="card-tag">{p.tag}</span>
                        </div>
                        <div className="card-body-inner">
                           <div className="card-price">{p.price}</div>
                           <div className="card-title">{p.title}</div>
                           <div className="card-location">
                              <i className="bi bi-geo-alt"></i>
                              {p.location}
                           </div>
                           <div className="card-meta">
                              <div className="meta-item">
                                 <i className="bi bi-door-open"></i>
                                 {p.beds} Rec
                              </div>
                              <div className="meta-item">
                                 <i className="bi bi-droplet"></i>
                                 {p.baths} Baños
                              </div>
                              <div className="meta-item">
                                 <i className="bi bi-aspect-ratio"></i>
                                 {p.sqft} m²
                              </div>
                           </div>
                        </div>
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default NubiaProperties
