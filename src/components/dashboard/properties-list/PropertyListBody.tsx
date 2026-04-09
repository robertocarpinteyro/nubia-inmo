"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"

interface Property {
   id: number
   title: string
   price: number
   status: string
   vendorCommission?: number
   isExclusive?: boolean
}

const PropertyListBody = () => {
   const { user, getAuthHeaders } = useAuth()
   const [props, setProps] = useState<Property[]>([])
   const [loading, setLoading] = useState(true)
   const [toast, setToast] = useState("")

   const isAdmin = user?.role === "admin"

   const load = () => {
      // Si es admin, ve toda la lista de propiedades general
      // Si es vendedor, ve solo las propiedades que se ha asigando
      const endpoint = isAdmin ? `${API_BASE_URL}/properties?limit=100` : `${API_BASE_URL}/vendor/properties`
      
      fetch(endpoint, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => {
            if (isAdmin) {
               setProps(Array.isArray(d.properties) ? d.properties : [])
            } else {
               setProps(Array.isArray(d) ? d : [])
            }
         })
         .catch(() => setProps([]))
         .finally(() => setLoading(false))
   }

   useEffect(() => { 
      if (user) load() 
   }, [user])

   // ===== Acciones Vendedor =====
   const updateVendorStatus = async (id: number, currentStatus: string) => {
      const newStatus = currentStatus === "available" ? "sold" : currentStatus === "sold" ? "rented" : "available"
      try {
         const res = await fetch(`${API_BASE_URL}/vendor/properties/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify({ status: newStatus }),
         })
         if (res.ok) {
            setToast("Estado de venta actualizado")
            load()
         }
      } catch {
         setToast("Error al actualizar")
      }
      setTimeout(() => setToast(""), 3000)
   }

   const deleteVendorProp = async (id: number) => {
      if (!confirm("¿Seguro que deseas dejar de trabajar esta propiedad?")) return
      try {
         const res = await fetch(`${API_BASE_URL}/vendor/properties/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
         })
         if (res.ok) {
            setToast("Propiedad eliminada de tu lista")
            load()
         }
      } catch {
         setToast("Error al eliminar")
      }
      setTimeout(() => setToast(""), 3000)
   }

   // ===== Acciones Admin =====
   const deleteAdminProp = async (id: number) => {
      if (!confirm("¿Estás seguro que deseas ELIMINAR esta propiedad permanentemente del sistema?")) return
      try {
         const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
         })
         if (res.ok) {
            setToast("Propiedad eliminada del sistema")
            load()
         }
      } catch {
         setToast("Error al eliminar propiedad")
      }
      setTimeout(() => setToast(""), 3000)
   }

   return (
      <div className="nubia-dash-card" style={{ marginTop: 24 }}>
         {toast && (
            <div style={{ position: "fixed", top: 80, right: 24, background: "#7B4FFF", color: "#fff", padding: "12px 20px", borderRadius: 8, zIndex: 9999, fontSize: 14 }}>
               {toast}
            </div>
         )}

         <div className="card-head d-flex justify-content-between align-items-center">
            <div>
               <h5 className="card-title">{isAdmin ? "Catálogo General de Propiedades" : "Mis Propiedades Asignadas"}</h5>
               <p style={{ margin: 0, fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
                  {isAdmin ? `Total en sistema: ${props.length}` : `Tienes ${props.length} asignadas para venta`}
               </p>
            </div>
            {isAdmin ? (
               <Link href="/dashboard/add-property" className="btn-nubia-sm primary"><i className="bi bi-plus"></i> Nueva Propiedad</Link>
            ) : (
               <Link href="/dashboard/available-properties" className="btn-nubia-sm primary">Explorar Nuevas</Link>
            )}
         </div>

         {loading ? (
            <div className="nubia-loading"><div className="spinner"></div></div>
         ) : props.length === 0 ? (
            <div className="nubia-empty-state">
               <i className="bi bi-building"></i>
               <p>{isAdmin ? "Aún no hay propiedades en la base de datos." : "No tienes propiedades asignadas."}</p>
            </div>
         ) : (
            <table className="nubia-table mt-3">
               <thead>
                  <tr>
                     <th>Título / Referencia</th>
                     <th>Precio</th>
                     <th>{isAdmin ? "Comisión Ofre." : "Mi Comisión"}</th>
                     <th>Estado</th>
                     <th>Acciones</th>
                  </tr>
               </thead>
               <tbody>
                  {props.map((p) => (
                     <tr key={p.id}>
                        <td>
                           <div className="cell-bold">{p.title}</div>
                           {p.isExclusive && <span className="nubia-badge purple mt-1">Exclusiva</span>}
                        </td>
                        <td className="cell-bold">${Number(p.price).toLocaleString("es-MX")}</td>
                        <td className="cell-bold" style={{ color: "#10b981" }}>{p.vendorCommission ?? 4}%</td>
                        <td>
                           <span className={`nubia-badge ${p.status === "available" ? "green" : p.status === "sold" ? "gray" : "amber"}`}>
                              {p.status === "available" ? "Disponible" : p.status === "sold" ? "Vendida" : p.status === "rented" ? "Rentada" : p.status}
                           </span>
                        </td>
                        <td className="d-flex gap-2">
                           {isAdmin ? (
                              <>
                                 <Link href={`/dashboard/edit-property/${p.id}`} className="btn-nubia-sm primary" title="Editar">
                                    <i className="bi bi-pencil"></i>
                                 </Link>
                                 <button onClick={() => deleteAdminProp(p.id)} className="btn-nubia-sm danger" title="Eliminar del sistema">
                                    <i className="bi bi-trash"></i>
                                 </button>
                              </>
                           ) : (
                              <>
                                 <button onClick={() => updateVendorStatus(p.id, p.status)} className="btn-nubia-sm outline" title="Cambiar Estado">
                                    <i className="bi bi-arrow-repeat"></i>
                                 </button>
                                 <button onClick={() => deleteVendorProp(p.id)} className="btn-nubia-sm danger" title="Dejar Propiedad">
                                    <i className="bi bi-x-circle"></i>
                                 </button>
                              </>
                           )}
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
