"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Property {
   id: string
   propertyId: string
   title: string
   price: number | null
   currency: string
   status: string | null
   type: string
   operation: string
   city: string | null
   featured: boolean
}

const statusLabel: Record<string, string> = {
   available: "Disponible", sold: "Vendida", rented: "Rentada", reserved: "Apartada",
}
const statusClass: Record<string, string> = {
   available: "green", sold: "gray", rented: "amber", reserved: "amber",
}

const PropertyListBody = () => {
   const [props, setProps] = useState<Property[]>([])
   const [loading, setLoading] = useState(true)
   const [toast, setToast] = useState("")

   const load = () => {
      setLoading(true)
      fetch(`/api/properties?limit=200`)
         .then(r => r.json())
         .then(d => setProps(Array.isArray(d.properties) ? d.properties : []))
         .catch(() => setProps([]))
         .finally(() => setLoading(false))
   }

   useEffect(() => { load() }, [])

   const deleteProp = async (id: string) => {
      if (!confirm("¿Eliminar esta propiedad permanentemente del sistema?")) return
      try {
         const res = await fetch(`/api/properties/${id}`, { method: "DELETE" })
         if (res.ok) {
            setToast("Propiedad eliminada")
            setProps(prev => prev.filter(p => p.id !== id))
         } else {
            const d = await res.json().catch(() => ({}))
            setToast(d.error || "Error al eliminar")
         }
      } catch {
         setToast("Error al eliminar")
      }
      setTimeout(() => setToast(""), 3000)
   }

   return (
      <div className="nubia-dash-card" style={{ marginTop: 24 }}>
         {toast && (
            <div style={{ position: "fixed", top: 80, right: 24, background: "#7B4FFF", color: "#fff", padding: "12px 20px", borderRadius: 8, zIndex: 9999, fontSize: 14 }}>{toast}</div>
         )}

         <div className="card-head d-flex justify-content-between align-items-center">
            <div>
               <h5 className="card-title">Catálogo General de Propiedades</h5>
               <p style={{ margin: 0, fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Total en sistema: {props.length}</p>
            </div>
            <Link href="/dashboard/add-property" className="btn-nubia-sm primary"><i className="bi bi-plus"></i> Nueva Propiedad</Link>
         </div>

         {loading ? (
            <div className="nubia-loading"><div className="spinner"></div></div>
         ) : props.length === 0 ? (
            <div className="nubia-empty-state">
               <i className="bi bi-building"></i>
               <p>Aún no hay propiedades en la base de datos.</p>
            </div>
         ) : (
            <table className="nubia-table mt-3">
               <thead>
                  <tr>
                     <th>Título / Referencia</th>
                     <th>Precio</th>
                     <th>Tipo / Operación</th>
                     <th>Estado</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody>
                  {props.map((p) => (
                     <tr key={p.id}>
                        <td>
                           <div className="cell-bold">{p.title}</div>
                           <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>{p.city ? `${p.city} · ` : ""}{p.propertyId}</div>
                           {p.featured && <span className="nubia-badge purple mt-1">Destacada</span>}
                        </td>
                        <td className="cell-bold">{p.price != null ? `$${Number(p.price).toLocaleString("es-MX")} ${p.currency}` : "—"}</td>
                        <td style={{ textTransform: "capitalize" }}>{p.type} · {p.operation}</td>
                        <td>
                           <span className={`nubia-badge ${statusClass[p.status ?? ""] ?? "gray"}`}>
                              {statusLabel[p.status ?? ""] ?? p.status ?? "—"}
                           </span>
                        </td>
                        <td className="d-flex gap-2">
                           <Link href={`/dashboard/edit-property/${p.id}`} className="btn-nubia-sm primary" title="Editar">
                              <i className="bi bi-pencil"></i>
                           </Link>
                           <button onClick={() => deleteProp(p.id)} className="btn-nubia-sm danger" title="Eliminar del sistema">
                              <i className="bi bi-trash"></i>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   )
}

export default PropertyListBody
