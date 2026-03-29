"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"

const AddPropertyBody = () => {
   const { getAuthHeaders } = useAuth()
   const router = useRouter()
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState("")

   const [form, setForm] = useState({
      title: "",
      description: "",
      propertyType: "casa",
      transactionType: "venta",
      price: "",
      currency: "MXN",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      bedrooms: "",
      bathrooms: "",
      parkingSpaces: "",
      totalArea: "",
      builtArea: "",
      yearBuilt: "",
      commissionPercentage: "4.0", // default
      featured: false,
   })

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target as any
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }))
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError("")

      try {
         const payload = {
            ...form,
            price: Number(form.price),
            bedrooms: Number(form.bedrooms) || 0,
            bathrooms: Number(form.bathrooms) || 0,
            parkingSpaces: Number(form.parkingSpaces) || 0,
            totalArea: Number(form.totalArea) || 0,
            builtArea: Number(form.builtArea) || 0,
            yearBuilt: Number(form.yearBuilt) || 0,
            commissionPercentage: Number(form.commissionPercentage) || 0,
         }

         const res = await fetch(`${API_BASE_URL}/properties`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify(payload),
         })

         const data = await res.json()
         if (!res.ok) throw new Error(data.message || "Error al crear la propiedad")
         
         // Redirigir a listado
         router.push("/dashboard/properties-list")
      } catch (err: any) {
         setError(err.message)
      } finally {
         setSaving(false)
      }
   }

   return (
      <div className="nubia-dash-card">
         <div className="card-head">
            <h5 className="card-title">Añadir Nueva Propiedad</h5>
         </div>

         <form onSubmit={handleSubmit} className="card-body-inner">
            {error && (
               <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", color: "#c53030", fontSize: 14, marginBottom: 20 }}>
                  {error}
               </div>
            )}

            <div className="row g-3">
               <div className="col-12">
                  <div className="nubia-form-group">
                     <label>Título de la Propiedad *</label>
                     <input name="title" value={form.title} onChange={handleChange} required placeholder="Ej. Casa Moderna en Polanco" />
                  </div>
               </div>
               <div className="col-12">
                  <div className="nubia-form-group">
                     <label>Descripción *</label>
                     <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe los detalles..." />
                  </div>
               </div>
               
               {/* Detalles basicos */}
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>Tipo de Inmueble</label>
                     <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="terreno">Terreno</option>
                        <option value="oficina">Oficina</option>
                        <option value="local">Local</option>
                     </select>
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>Operación</label>
                     <select name="transactionType" value={form.transactionType} onChange={handleChange}>
                        <option value="venta">Venta</option>
                        <option value="renta">Renta</option>
                     </select>
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>Precio *</label>
                     <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="0.00" min="0" />
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>Moneda</label>
                     <select name="currency" value={form.currency} onChange={handleChange}>
                        <option value="MXN">MXN</option>
                        <option value="USD">USD</option>
                     </select>
                  </div>
               </div>

               {/* Características */}
               <div className="col-md-4 col-lg-2">
                  <div className="nubia-form-group">
                     <label>Recámaras</label>
                     <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-4 col-lg-2">
                  <div className="nubia-form-group">
                     <label>Baños</label>
                     <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-4 col-lg-2">
                  <div className="nubia-form-group">
                     <label>Estacionamientos</label>
                     <input type="number" name="parkingSpaces" value={form.parkingSpaces} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>Área Terreno (m²)</label>
                     <input type="number" name="totalArea" value={form.totalArea} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>Área Construida (m²)</label>
                     <input type="number" name="builtArea" value={form.builtArea} onChange={handleChange} min="0" />
                  </div>
               </div>

               {/* Ubicación */}
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>Dirección</label>
                     <input name="address" value={form.address} onChange={handleChange} placeholder="Calle y número" />
                  </div>
               </div>
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>Ciudad</label>
                     <input name="city" value={form.city} onChange={handleChange} />
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>Estado</label>
                     <input name="state" value={form.state} onChange={handleChange} />
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>Código Postal</label>
                     <input name="zipCode" value={form.zipCode} onChange={handleChange} />
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>Año Construcción</label>
                     <input type="number" name="yearBuilt" value={form.yearBuilt} onChange={handleChange} min="1900" max="2099" />
                  </div>
               </div>

               {/* Extra */}
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>Comisión Vendedor (%)</label>
                     <input type="number" step="0.1" name="commissionPercentage" value={form.commissionPercentage} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-6 d-flex align-items-center">
                  <div className="form-check pt-4">
                     <input className="form-check-input" type="checkbox" name="featured" id="featuredCheck" checked={form.featured} onChange={handleChange} />
                     <label className="form-check-label" htmlFor="featuredCheck">
                        Marcar como Propiedad Destacada
                     </label>
                  </div>
               </div>

               <div className="col-12 mt-4 text-end">
                  <button type="submit" className="btn-nubia-sm primary" disabled={saving}>
                     {saving ? "Guardando..." : "Crear Propiedad"}
                  </button>
               </div>
            </div>
         </form>
      </div>
   )
}

export default AddPropertyBody
