"use client"
import Fancybox from "@/components/common/Fancybox"
import { useLanguage } from "@/context/LanguageContext"

interface MediaItem {
   id: number
   url: string
   mediaType: string
   sortOrder: number
   title?: string
}

interface Props {
   media: MediaItem[]
}

const MediaGallery = ({ media }: Props) => {
   const { lang } = useLanguage()
   const images = media.filter(m => m.mediaType === "image").sort((a, b) => a.sortOrder - b.sortOrder)

   if (images.length === 0) {
      return (
         <div className="media-gallery-grid p0 mb-60">
            <div style={{ background: "#1a1a1a", borderRadius: 12, height: 320, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3, fontSize: 14 }}>
               {lang === "en" ? "No images available" : "Sin imágenes disponibles"}
            </div>
         </div>
      )
   }

   const [main, ...thumbs] = images

   return (
      <div className="media-gallery-grid p0 mb-60">
         <div id="media_slider" className="carousel slide row">
            <div className="col-lg-10">
               <div className="bg-white shadow4 border-20 p-30 md-mb-20">
                  <div className="position-relative z-1 overflow-hidden border-20">
                     <div className="img-fancy-btn border-10 fw-500 fs-16 color-dark">
                        {lang === "en" ? `See all ${images.length} photos` : `Ver las ${images.length} fotos`}
                        <Fancybox options={{ Carousel: { infinite: true } }}>
                           {images.map((img, i) => (
                              <a key={i} className="d-block" data-fancybox="prop-gallery" href={img.url} />
                           ))}
                        </Fancybox>
                     </div>
                     <div className="carousel-inner">
                        {images.map((img, i) => (
                           <div key={img.id} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                              <img src={img.url} alt={img.title || ""} className="border-20 w-100" style={{ objectFit: "cover", maxHeight: 480 }} />
                           </div>
                        ))}
                     </div>
                     <button className="carousel-control-prev" type="button" data-bs-target="#media_slider" data-bs-slide="prev">
                        <i className="bi bi-chevron-left"></i>
                        <span className="visually-hidden">Previous</span>
                     </button>
                     <button className="carousel-control-next" type="button" data-bs-target="#media_slider" data-bs-slide="next">
                        <i className="bi bi-chevron-right"></i>
                        <span className="visually-hidden">Next</span>
                     </button>
                  </div>
               </div>
            </div>

            {thumbs.length > 0 && (
               <div className="col-lg-2">
                  <div className="carousel-indicators position-relative border-15 bg-white shadow4 p-15 w-100 h-100">
                     {images.slice(0, 4).map((img, i) => (
                        <button key={img.id} type="button" data-bs-target="#media_slider" data-bs-slide-to={`${i}`}
                           className={i === 0 ? "active" : ""} aria-label={`Slide ${i + 1}`}>
                           <img src={img.url} alt="" className="border-10 w-100" style={{ objectFit: "cover", height: 60 }} />
                        </button>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

export default MediaGallery
