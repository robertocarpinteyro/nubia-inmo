"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

const AddPropertyBody = ({ propertyId }: { propertyId?: string }) => {
   const { getAuthHeaders } = useAuth()
   const { t } = useLanguage()
   const router = useRouter()
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState("")

   const [form, setForm] = useState({
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
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
      commissionPercentage: "4.0",
      featured: false,
      discountPrice: "",
      mediaUrls: "",
      videoUrl: "",
      googleMapsUrl: "",
   })

   useEffect(() => {
      if (propertyId) {
         fetch(`${API_BASE_URL}/properties/${propertyId}`, { headers: getAuthHeaders() })
            .then(res => res.json())
            .then(data => {
               if (data && !data.error) {
                  setForm(prev => ({
                     ...prev,
                     title: data.title || "",
                     titleEn: data.titleEn || "",
                     description: data.description || "",
                     descriptionEn: data.descriptionEn || "",
                     propertyType: data.propertyType || "casa",
                     transactionType: data.transactionType || "venta",
                     price: data.price ? String(data.price) : "",
                     currency: data.currency || "MXN",
                     address: data.address || "",
                     city: data.city || "",
                     state: data.state || "",
                     zipCode: data.zipCode || "",
                     bedrooms: data.bedrooms !== null ? String(data.bedrooms) : "",
                     bathrooms: data.bathrooms ? String(data.bathrooms) : "",
                     parkingSpaces: data.parkingSpaces !== null ? String(data.parkingSpaces) : "",
                     totalArea: data.totalArea ? String(data.totalArea) : "",
                     builtArea: data.builtArea ? String(data.builtArea) : "",
                     yearBuilt: data.yearBuilt ? String(data.yearBuilt) : "",
                     commissionPercentage: data.commissionPercentage ? String(data.commissionPercentage) : "4.0",
                     featured: data.featured || false,
                     discountPrice: data.discountPrice ? String(data.discountPrice) : "",
                     mediaUrls: "", // We keep empty so they can append new ones without deleting old
                     videoUrl: data.videoUrl || "",
                     googleMapsUrl: data.googleMapsUrl || "",
                  }))
               }
            })
            .catch(console.error);
      }
   }, [propertyId]);

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
            discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
            bedrooms: Number(form.bedrooms) || 0,
            bathrooms: form.bathrooms ? String(form.bathrooms) : "0",
            parkingSpaces: Number(form.parkingSpaces) || 0,
            totalArea: Number(form.totalArea) || 0,
            builtArea: Number(form.builtArea) || 0,
            yearBuilt: Number(form.yearBuilt) || 0,
            commissionPercentage: Number(form.commissionPercentage) || 0,
            mediaUrls: form.mediaUrls ? form.mediaUrls.split(/[\n,]+/).map((u: string) => u.trim()).filter(Boolean) : [],
         }

         const urlEndpoint = propertyId ? `${API_BASE_URL}/properties/${propertyId}` : `${API_BASE_URL}/properties`;
         const methodReq = propertyId ? "PUT" : "POST";

         const res = await fetch(urlEndpoint, {
            method: methodReq,
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify(payload),
         })

         const data = await res.json()
         if (!res.ok) {
            console.error("Detalles del servidor:", data.details);
            const detailMsg = data.details?.errors ? data.details.errors.map((e: any) => e.message).join(", ") : JSON.stringify(data.details);
            throw new Error(data.error ? `${data.error}: ${detailMsg}` : data.message || (propertyId ? "Error al editar" : "Error al crear la propiedad"))
         }

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
            <h5 className="card-title">{propertyId ? "Editar Propiedad" : t("addProperty.title")}</h5>
         </div>

         <form onSubmit={handleSubmit} className="card-body-inner">
            {error && (
               <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", color: "#c53030", fontSize: 14, marginBottom: 20 }}>
                  {error}
               </div>
            )}

            <div className="row g-3">

               {/* ── Sección Español ── */}
               <div className="col-12">
                  <div style={{ borderLeft: "3px solid #7B4FFF", paddingLeft: 12, marginBottom: 4 }}>
                     <span style={{ fontWeight: 600, fontSize: 13, color: "#7B4FFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {t("addProperty.sectionES")}
                     </span>
                  </div>
               </div>

               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.titleLabel")}</label>
                     <input name="title" value={form.title} onChange={handleChange} required placeholder={t("addProperty.titlePlaceholder")} />
                  </div>
               </div>
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.titleEnLabel")} <span style={{ opacity: 0.55, fontSize: 12, fontStyle: "italic" }}>English</span></label>
                     <input name="titleEn" value={form.titleEn} onChange={handleChange} placeholder={t("addProperty.titleEnPlaceholder")} />
                  </div>
               </div>

               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.descriptionLabel")}</label>
                     <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder={t("addProperty.descriptionPlaceholder")} />
                  </div>
               </div>
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.descriptionEnLabel")} <span style={{ opacity: 0.55, fontSize: 12, fontStyle: "italic" }}>English</span></label>
                     <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} rows={4} placeholder={t("addProperty.descriptionEnPlaceholder")} />
                  </div>
               </div>

               {/* ── Detalles básicos ── */}
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.propertyType")}</label>
                     <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                        <option value="casa">{t("addProperty.types.casa")}</option>
                        <option value="departamento">{t("addProperty.types.departamento")}</option>
                        <option value="terreno">{t("addProperty.types.terreno")}</option>
                        <option value="oficina">{t("addProperty.types.oficina")}</option>
                        <option value="local">{t("addProperty.types.local")}</option>
                     </select>
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.transaction")}</label>
                     <select name="transactionType" value={form.transactionType} onChange={handleChange}>
                        <option value="venta">{t("addProperty.transactions.venta")}</option>
                        <option value="renta">{t("addProperty.transactions.renta")}</option>
                     </select>
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.price")}</label>
                     <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="0.00" min="0" />
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>Precio con Descuento (Opcional)</label>
                     <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} placeholder="0.00" min="0" />
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.currency")}</label>
                     <select name="currency" value={form.currency} onChange={handleChange}>
                        <option value="MXN">MXN</option>
                        <option value="USD">USD</option>
                     </select>
                  </div>
               </div>

               {/* ── Características ── */}
               <div className="col-md-4 col-lg-2">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.bedrooms")}</label>
                     <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-4 col-lg-2">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.bathrooms")} <span style={{ opacity: 0.55, fontSize: 12, fontStyle: "italic" }}>(ej. 3.5 o 3 1/2)</span></label>
                     <input type="text" name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="Ej. 3 1/2" />
                  </div>
               </div>
               <div className="col-md-4 col-lg-2">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.parking")}</label>
                     <input type="number" name="parkingSpaces" value={form.parkingSpaces} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.totalArea")}</label>
                     <input type="number" name="totalArea" value={form.totalArea} onChange={handleChange} min="0" step="any" />
                  </div>
               </div>
               <div className="col-md-6 col-lg-3">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.builtArea")}</label>
                     <input type="number" name="builtArea" value={form.builtArea} onChange={handleChange} min="0" step="any" />
                  </div>
               </div>

               {/* ── Ubicación ── */}
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.address")}</label>
                     <input name="address" value={form.address} onChange={handleChange} placeholder={t("addProperty.addressPlaceholder")} />
                  </div>
               </div>
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.city")}</label>
                     <input name="city" value={form.city} onChange={handleChange} />
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.state")}</label>
                     <input name="state" value={form.state} onChange={handleChange} />
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.zipCode")}</label>
                     <input name="zipCode" value={form.zipCode} onChange={handleChange} />
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.yearBuilt")}</label>
                     <input type="number" name="yearBuilt" value={form.yearBuilt} onChange={handleChange} min="1900" max="2099" />
                  </div>
               </div>

               {/* ── Extra ── */}
               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>{t("addProperty.commission")}</label>
                     <input type="number" step="0.1" name="commissionPercentage" value={form.commissionPercentage} onChange={handleChange} min="0" />
                  </div>
               </div>
               <div className="col-md-6 d-flex align-items-center">
                  <div className="form-check pt-4">
                     <input className="form-check-input" type="checkbox" name="featured" id="featuredCheck" checked={form.featured} onChange={handleChange} />
                     <label className="form-check-label" htmlFor="featuredCheck">
                        {t("addProperty.featured")}
                     </label>
                  </div>
               </div>

               {/* ── Media ── */}
               <div className="col-12 mt-2">
                  <div style={{ borderLeft: "3px solid #7B4FFF", paddingLeft: 12, marginBottom: 12 }}>
                     <span style={{ fontWeight: 600, fontSize: 13, color: "#7B4FFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Media &amp; Ubicación
                     </span>
                  </div>
               </div>

               <div className="col-12">
                  <div className="nubia-form-group">
                     <label>URLs de Imágenes <span style={{ opacity: 0.55, fontSize: 12, fontStyle: "italic" }}>(separadas por comas o saltos de línea)</span></label>
                     <textarea name="mediaUrls" value={form.mediaUrls} onChange={handleChange} rows={3} placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.png" />
                  </div>
               </div>

               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>URL del Video <span style={{ opacity: 0.55, fontSize: 12, fontStyle: "italic" }}>(YouTube, Vimeo o MP4 directo)</span></label>
                     <input
                        type="url"
                        name="videoUrl"
                        value={form.videoUrl}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                     />
                  </div>
               </div>

               <div className="col-md-6">
                  <div className="nubia-form-group">
                     <label>URL de Google Maps <span style={{ opacity: 0.55, fontSize: 12, fontStyle: "italic" }}>(link de embed o share)</span></label>
                     <input
                        type="url"
                        name="googleMapsUrl"
                        value={form.googleMapsUrl}
                        onChange={handleChange}
                        placeholder="https://maps.google.com/maps?q=..."
                     />
                  </div>
               </div>

               <div className="col-12 mt-4 text-end">
                  <button type="submit" className="btn-nubia-sm primary" disabled={saving}>
                     {saving ? t("addProperty.saving") : (propertyId ? "Guardar Cambios" : t("addProperty.save"))}
                  </button>
               </div>
            </div>
         </form>
      </div>
   )
}

export default AddPropertyBody
