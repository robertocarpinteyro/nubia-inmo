"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"

interface Property {
   id: number
   title: string
   price: number
   status: string
   vendorCommission?: number
   vendorsCount?: number
   images?: string[]
   location?: string
}

const AvailablePropertiesPage = () => {
   const { getAuthHeaders } = useAuth()
   const [props, setProps] = useState<Property[]>([])
   const [loading, setLoading] = useState(true)
   const [offering, setOffering] = useState<number | null>(null)
   const [toast, setToast] = useState("")

   useEffect(() => {
      fetch(`${API_BASE_URL}/vendor/available-properties`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => setProps(Array.isArray(d) ? d : []))
         .catch(() => setProps([]))
         .finally(() => setLoading(false))
   }, [])

   const ofertar = async (id: number) => {
      setOffering(id)
      try {
         const res = await fetch(`${API_BASE_URL}/vendor/properties/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
         })
         const data = await res.json()
         setToast(res.ok ? "¡Propiedad ofertada con éxito!" : data.message ?? "Error")
      } catch {
         setToast("Error de conexión")
      } finally {
         setOffering(null)
         setTimeout(() => setToast(""), 3000)
      }
   }

   return (
      <DashboardLayout title="Explorar Propiedades" allowedRoles={["vendedor"]}>
         {toast && (
            <div style={{ position: "fixed", top: 80, right: 24, background: "#7B4FFF", color: "#fff", padding: "12px 20px", borderRadius: 8, zIndex: 9999, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(123,79,255,0.3)" }}>
               {toast}
            </div>
         )}

         <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
               <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Propiedades Disponibles</h2>
               <p style={{ fontSize: 14, color: "rgba(0,0,0,0.4)", margin: 0 }}>Selecciona propiedades para ofertar</p>
            </div>
         </div>

         {loading ? (
            <div className="nubia-loading"><div className="spinner"></div></div>
         ) : props.length === 0 ? (
            <div className="nubia-empty-state">
               <i className="bi bi-building"></i>
               <p>No hay propiedades disponibles en este momento</p>
            </div>
         ) : (
            <div className="row g-3">
               {props.map((p) => (
                  <div key={p.id} className="col-lg-4 col-md-6">
                     <div className="nubia-dash-prop-card">
                        <div className="prop-thumb">
                           {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.title} />
                           ) : (
                              <div style={{ width: "100%", height: "100%", background: "#e8e8e4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <i className="bi bi-building" style={{ fontSize: 32, color: "rgba(0,0,0,0.2)" }}></i>
                              </div>
                           )}
                           <span className="prop-tag">{p.status}</span>
                        </div>
                        <div className="prop-body">
                           <div className="prop-price">${Number(p.price).toLocaleString("es-MX")}</div>
                           <div className="prop-title">{p.title}</div>
                           {p.location && <div className="prop-meta"><span><i className="bi bi-geo-alt"></i>{p.location}</span></div>}
                           <div className="prop-commission">
                              <span>Comisión: <strong>{p.vendorCommission ?? 4}%</strong></span>
                              <span>{p.vendorsCount ?? 0} vendedores</span>
                           </div>
                           <div className="d-flex gap-2 mt-3">
                              <button
                                 className="btn-nubia-sm primary flex-fill justify-content-center"
                                 onClick={() => ofertar(p.id)}
                                 disabled={offering === p.id}
                              >
                                 {offering === p.id ? "Ofertando…" : <><i className="bi bi-plus-circle"></i> Ofertar</>}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </DashboardLayout>
   )
}

export default AvailablePropertiesPage
