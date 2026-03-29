"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"

interface Favorite {
   id: number
   propertyId: number
   property?: {
      id: number
      title: string
      price: number
      address: string
      bedrooms: number
      bathrooms: number
      totalArea: number
      status: string
      images?: string[]
   }
}

const FavouriteArea = () => {
   const { getAuthHeaders } = useAuth()
   const [favs, setFavs] = useState<Favorite[]>([])
   const [loading, setLoading] = useState(true)
   const [toast, setToast] = useState("")

   const load = () => {
      fetch(`${API_BASE_URL}/favorites`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => setFavs(Array.isArray(d) ? d : []))
         .catch(() => setFavs([]))
         .finally(() => setLoading(false))
   }

   useEffect(() => { load() }, [])

   const removeFavorite = async (propertyId: number) => {
      try {
         const res = await fetch(`${API_BASE_URL}/favorites/${propertyId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
         })
         if (res.ok) {
            setToast("Propiedad eliminada de favoritos")
            load()
         }
      } catch {
         setToast("Error al eliminar favorito")
      }
      setTimeout(() => setToast(""), 3000)
   }

   return (
      <div className="nubia-dash-card" style={{ marginTop: 24, minHeight: 400 }}>
         {toast && (
            <div style={{ position: "fixed", top: 80, right: 24, background: "#7B4FFF", color: "#fff", padding: "12px 20px", borderRadius: 8, zIndex: 9999, fontSize: 14 }}>
               {toast}
            </div>
         )}

         <div className="card-head d-flex justify-content-between align-items-center mb-4">
            <div>
               <h5 className="card-title">Mis Favoritos</h5>
               <p style={{ margin: 0, fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
                  Has guardado {favs.length} {favs.length === 1 ? "propiedad" : "propiedades"}
               </p>
            </div>
            <Link href="/listing_07" className="btn-nubia-sm primary">Explorar Más</Link>
         </div>

         {loading ? (
            <div className="nubia-loading"><div className="spinner"></div></div>
         ) : favs.length === 0 ? (
            <div className="nubia-empty-state">
               <i className="bi bi-heart"></i>
               <p>No tienes propiedades favoritas guardadas.</p>
            </div>
         ) : (
            <div className="row g-4">
               {favs.map(({ property }) => {
                  if (!property) return null
                  return (
                     <div key={property.id} className="col-lg-4 col-md-6">
                        <div className="nubia-dash-prop-card h-100">
                           <div className="prop-thumb" style={{ height: 200 }}>
                              {property.images?.[0] ? (
                                 <img src={property.images[0]} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                 <div style={{ width: "100%", height: "100%", background: "#e8e8e4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bi bi-house" style={{ fontSize: 32, color: "rgba(0,0,0,0.2)" }}></i>
                                 </div>
                              )}
                              <span className="prop-tag">{property.status}</span>
                              <button 
                                 className="fav-btn-active" 
                                 title="Quitar de favoritos"
                                 onClick={() => removeFavorite(property.id)}
                                 style={{ position: "absolute", top: 12, right: 12, background: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#e63946", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                              >
                                 <i className="bi bi-heart-fill"></i>
                              </button>
                           </div>
                           <div className="prop-body">
                              <div className="prop-price">${Number(property.price).toLocaleString("es-MX")}</div>
                              <div className="prop-title">{property.title}</div>
                              {property.address && <div className="prop-meta"><span><i className="bi bi-geo-alt"></i>{property.address}</span></div>}
                              
                              <div className="d-flex align-items-center gap-3 mt-3 pt-3 border-top" style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                                 <span><i className="bi bi-arrows-fullscreen me-1"></i> {property.totalArea} m²</span>
                                 <span><i className="bi bi-door-open me-1"></i> {property.bedrooms} Rec</span>
                                 <span><i className="bi bi-droplet me-1"></i> {property.bathrooms} Baños</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
         )}
      </div>
   )
}

export default FavouriteArea
