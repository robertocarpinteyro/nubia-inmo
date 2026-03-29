"use client"
import { useEffect, useState } from "react"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import Link from "next/link"

interface Review {
   id: number
   rating: number
   comment: string
   isVisible: boolean
   property?: { id: number; title: string }
   createdAt: string
}

const ReviewBody = () => {
   const { getAuthHeaders } = useAuth()
   const [reviews, setReviews] = useState<Review[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      fetch(`${API_BASE_URL}/reviews/me`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => setReviews(Array.isArray(d) ? d : []))
         .catch(() => setReviews([]))
         .finally(() => setLoading(false))
   }, [getAuthHeaders])

   return (
      <div className="nubia-dash-card" style={{ marginTop: 24, minHeight: 400 }}>
         <div className="card-head d-flex justify-content-between align-items-center mb-4">
            <div>
               <h5 className="card-title">Mis Reseñas</h5>
               <p style={{ margin: 0, fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
                  Has dejado {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
               </p>
            </div>
            <Link href="/listing_07" className="btn-nubia-sm primary">Explorar Propiedades</Link>
         </div>

         {loading ? (
            <div className="nubia-loading"><div className="spinner"></div></div>
         ) : reviews.length === 0 ? (
            <div className="nubia-empty-state">
               <i className="bi bi-star"></i>
               <p>No has escrito ninguna reseña todavía.</p>
            </div>
         ) : (
            <div className="d-flex flex-column gap-3">
               {reviews.map((r) => (
                  <div key={r.id} style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, padding: 20 }}>
                     <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                           {r.property?.title ?? "Propiedad Desconocida"}
                        </h6>
                        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>
                           {new Date(r.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                     </div>
                     
                     <div style={{ color: "#f59e0b", fontSize: 14, marginBottom: 8 }}>
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                     </div>
                     
                     <p style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", margin: 0, lineHeight: 1.6 }}>
                        "{r.comment}"
                     </p>
                     
                     {!r.isVisible && (
                        <div style={{ marginTop: 12 }}>
                           <span className="nubia-badge red">Oculta por administrador</span>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}

export default ReviewBody
