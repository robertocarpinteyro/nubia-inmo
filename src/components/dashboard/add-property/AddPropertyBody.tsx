"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const PROPERTY_TYPES = [
   { value: "casa", label: "Casa" },
   { value: "departamento", label: "Departamento" },
   { value: "terreno", label: "Terreno" },
   { value: "oficina", label: "Oficina" },
   { value: "local", label: "Local" },
   { value: "lote", label: "Lote" },
]

interface FormState {
   title: string
   description: string
   propertyType: string
   transactionType: string
   price: string
   currency: string
   address: string
   city: string
   state: string
   zipCode: string
   development: string
   bedrooms: string
   bathrooms: string
   parkingSpaces: string
   totalArea: string
   builtArea: string
   amenities: string
   images: string[]
   floorPlans: string[]
   videoUrl: string
   virtualTour: string
   technicalSheetUrl: string
   googleMapsUrl: string
   featured: boolean
   published: boolean
   status: string
}

const emptyForm: FormState = {
   title: "", description: "", propertyType: "casa", transactionType: "venta",
   price: "", currency: "MXN", address: "", city: "", state: "", zipCode: "",
   development: "", bedrooms: "", bathrooms: "", parkingSpaces: "", totalArea: "",
   builtArea: "", amenities: "", images: [], floorPlans: [], videoUrl: "",
   virtualTour: "", technicalSheetUrl: "", googleMapsUrl: "", featured: false,
   published: true, status: "available",
}

const AddPropertyBody = ({ propertyId }: { propertyId?: string }) => {
   const router = useRouter()
   const supabase = createClient()
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState("")
   const [uploading, setUploading] = useState<"images" | "floor" | "doc" | null>(null)
   const [form, setForm] = useState<FormState>(emptyForm)

   useEffect(() => {
      if (!propertyId) return
      fetch(`/api/properties/${propertyId}`)
         .then(res => res.json())
         .then(data => {
            if (data && !data.error) {
               setForm(prev => ({
                  ...prev,
                  ...data,
                  price: data.price != null ? String(data.price) : "",
                  bedrooms: data.bedrooms != null ? String(data.bedrooms) : "",
                  parkingSpaces: data.parkingSpaces != null ? String(data.parkingSpaces) : "",
                  totalArea: data.totalArea != null ? String(data.totalArea) : "",
                  builtArea: data.builtArea != null ? String(data.builtArea) : "",
                  amenities: Array.isArray(data.amenities) ? data.amenities.join(", ") : "",
                  images: Array.isArray(data.images) ? data.images : [],
                  floorPlans: Array.isArray(data.floorPlans) ? data.floorPlans : [],
               }))
            }
         })
         .catch(console.error)
   }, [propertyId])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target as any
      const checked = (e.target as HTMLInputElement).checked
      setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
   }

   // ── Subida a Supabase Storage vía signed upload URL ─────────────
   const uploadFiles = async (files: FileList | null, kind: "images" | "floor" | "doc") => {
      if (!files || files.length === 0) return
      setUploading(kind)
      setError("")
      const bucketKind = kind === "doc" ? "docs" : "images"
      const urls: string[] = []
      try {
         for (const file of Array.from(files)) {
            const res = await fetch("/api/uploads", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ kind: bucketKind, propertyId: propertyId || "nueva", filename: file.name }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Error al pedir URL de subida")
            const { error: upErr } = await supabase.storage
               .from(data.bucket)
               .uploadToSignedUrl(data.path, data.token, file)
            if (upErr) throw new Error(upErr.message)
            urls.push(data.publicUrl)
         }
         setForm(prev => {
            if (kind === "images") return { ...prev, images: [...prev.images, ...urls] }
            if (kind === "floor") return { ...prev, floorPlans: [...prev.floorPlans, ...urls] }
            return { ...prev, technicalSheetUrl: urls[0] }
         })
      } catch (err: any) {
         setError(err.message || "Error al subir archivos")
      } finally {
         setUploading(null)
      }
   }

   const removeImage = (idx: number) =>
      setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
   const removeFloor = (idx: number) =>
      setForm(prev => ({ ...prev, floorPlans: prev.floorPlans.filter((_, i) => i !== idx) }))

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError("")
      try {
         const payload = {
            title: form.title,
            description: form.description,
            propertyType: form.propertyType,
            transactionType: form.transactionType,
            price: form.price,
            currency: form.currency,
            address: form.address,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
            development: form.development,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            parkingSpaces: form.parkingSpaces,
            totalArea: form.totalArea,
            builtArea: form.builtArea,
            amenities: form.amenities.split(/[\n,]+/).map(s => s.trim()).filter(Boolean),
            images: form.images,
            floorPlans: form.floorPlans,
            videoUrl: form.videoUrl,
            virtualTour: form.virtualTour,
            technicalSheetUrl: form.technicalSheetUrl,
            googleMapsUrl: form.googleMapsUrl,
            featured: form.featured,
            published: form.published,
            status: form.status,
         }
         const url = propertyId ? `/api/properties/${propertyId}` : "/api/properties"
         const method = propertyId ? "PATCH" : "POST"
         const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         })
         const data = await res.json()
         if (!res.ok) throw new Error(data.error || "Error al guardar la propiedad")
         router.push("/dashboard/properties-list")
         router.refresh()
      } catch (err: any) {
         setError(err.message)
      } finally {
         setSaving(false)
      }
   }

   const sectionLabel = (text: string) => (
      <div className="col-12 mt-2">
         <div style={{ borderLeft: "3px solid #7B4FFF", paddingLeft: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#7B4FFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{text}</span>
         </div>
      </div>
   )

   const thumb = (urls: string[], onRemove: (i: number) => void) => (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginTop: 8 }}>
         {urls.map((u, i) => (
            <div key={i} style={{ position: "relative", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(123,79,255,0.2)", background: "#0C0C0C" }}>
               <img src={u} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
               <button type="button" onClick={() => onRemove(i)} title="Quitar"
                  style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(239,68,68,0.85)", border: "none", cursor: "pointer", color: "#fff", lineHeight: 1 }}>×</button>
            </div>
         ))}
      </div>
   )

   return (
      <div className="nubia-dash-card">
         <div className="card-head">
            <h5 className="card-title">{propertyId ? "Editar Propiedad" : "Agregar Propiedad"}</h5>
         </div>

         <form onSubmit={handleSubmit} className="card-body-inner">
            {error && (
               <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "10px 14px", color: "#c53030", fontSize: 14, marginBottom: 20 }}>{error}</div>
            )}

            <div className="row g-3">
               {sectionLabel("Información general")}

               <div className="col-md-8">
                  <div className="nubia-form-group">
                     <label>Título *</label>
                     <input name="title" value={form.title} onChange={handleChange} required placeholder="Ej. Casa en Bosque Real" />
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>Tipo de propiedad</label>
                     <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                        {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                     </select>
                  </div>
               </div>

               <div className="col-12">
                  <div className="nubia-form-group">
                     <label>Descripción</label>
                     <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe la propiedad..." />
                  </div>
               </div>

               <div className="col-md-3">
                  <div className="nubia-form-group">
                     <label>Operación</label>
                     <select name="transactionType" value={form.transactionType} onChange={handleChange}>
                        <option value="venta">Venta</option>
                        <option value="renta">Renta</option>
                     </select>
                  </div>
               </div>
               <div className="col-md-3">
                  <div className="nubia-form-group">
                     <label>Precio *</label>
                     <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="0.00" />
                  </div>
               </div>
               <div className="col-md-3">
                  <div className="nubia-form-group">
                     <label>Moneda</label>
                     <select name="currency" value={form.currency} onChange={handleChange}>
                        <option value="MXN">MXN</option>
                        <option value="USD">USD</option>
                     </select>
                  </div>
               </div>
               <div className="col-md-3">
                  <div className="nubia-form-group">
                     <label>Estado</label>
                     <select name="status" value={form.status} onChange={handleChange}>
                        <option value="available">Disponible</option>
                        <option value="sold">Vendida</option>
                        <option value="rented">Rentada</option>
                        <option value="reserved">Apartada</option>
                     </select>
                  </div>
               </div>

               {sectionLabel("Características")}
               <div className="col-6 col-md-2"><div className="nubia-form-group"><label>Recámaras</label><input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} min="0" /></div></div>
               <div className="col-6 col-md-2"><div className="nubia-form-group"><label>Baños <span style={{ opacity: 0.55, fontSize: 11 }}>(3 o 3 1/2)</span></label><input type="text" name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="3 1/2" /></div></div>
               <div className="col-6 col-md-2"><div className="nubia-form-group"><label>Estacionam.</label><input type="number" name="parkingSpaces" value={form.parkingSpaces} onChange={handleChange} min="0" /></div></div>
               <div className="col-6 col-md-3"><div className="nubia-form-group"><label>Área total (m²)</label><input type="number" name="totalArea" value={form.totalArea} onChange={handleChange} min="0" step="any" /></div></div>
               <div className="col-6 col-md-3"><div className="nubia-form-group"><label>Área construida (m²)</label><input type="number" name="builtArea" value={form.builtArea} onChange={handleChange} min="0" step="any" /></div></div>
               <div className="col-12"><div className="nubia-form-group"><label>Amenidades <span style={{ opacity: 0.55, fontSize: 11 }}>(separadas por comas)</span></label><input name="amenities" value={form.amenities} onChange={handleChange} placeholder="Alberca, Gimnasio, Seguridad 24/7" /></div></div>

               {sectionLabel("Ubicación")}
               <div className="col-md-6"><div className="nubia-form-group"><label>Dirección</label><input name="address" value={form.address} onChange={handleChange} /></div></div>
               <div className="col-md-3"><div className="nubia-form-group"><label>Ciudad</label><input name="city" value={form.city} onChange={handleChange} /></div></div>
               <div className="col-md-3"><div className="nubia-form-group"><label>Estado</label><input name="state" value={form.state} onChange={handleChange} /></div></div>
               <div className="col-md-6"><div className="nubia-form-group"><label>Desarrollo</label><input name="development" value={form.development} onChange={handleChange} placeholder="Ej. Bosque Real" /></div></div>
               <div className="col-md-3"><div className="nubia-form-group"><label>C.P.</label><input name="zipCode" value={form.zipCode} onChange={handleChange} /></div></div>
               <div className="col-md-3"><div className="nubia-form-group"><label>Google Maps (embed)</label><input name="googleMapsUrl" value={form.googleMapsUrl} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..." /></div></div>

               {sectionLabel("Imágenes")}
               <div className="col-12">
                  <div className="nubia-form-group">
                     <label>Subir imágenes {uploading === "images" && <span style={{ color: "#7B4FFF" }}>· subiendo…</span>}</label>
                     <input type="file" accept="image/*" multiple disabled={uploading === "images"} onChange={e => uploadFiles(e.target.files, "images")} />
                     {form.images.length > 0 && thumb(form.images, removeImage)}
                  </div>
               </div>

               {sectionLabel("Planos / Recorrido / Video / Ficha")}
               <div className="col-12">
                  <div className="nubia-form-group">
                     <label>Subir planos (imágenes) {uploading === "floor" && <span style={{ color: "#7B4FFF" }}>· subiendo…</span>}</label>
                     <input type="file" accept="image/*" multiple disabled={uploading === "floor"} onChange={e => uploadFiles(e.target.files, "floor")} />
                     {form.floorPlans.length > 0 && thumb(form.floorPlans, removeFloor)}
                  </div>
               </div>
               <div className="col-md-6"><div className="nubia-form-group"><label>Recorrido virtual (URL)</label><input name="virtualTour" value={form.virtualTour} onChange={handleChange} placeholder="https://..." /></div></div>
               <div className="col-md-6"><div className="nubia-form-group"><label>Video (URL — YouTube/Vimeo/MP4)</label><input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." /></div></div>
               <div className="col-md-8"><div className="nubia-form-group"><label>Ficha técnica (PDF) — URL</label><input name="technicalSheetUrl" value={form.technicalSheetUrl} onChange={handleChange} placeholder="https://....pdf" /></div></div>
               <div className="col-md-4">
                  <div className="nubia-form-group">
                     <label>o subir PDF {uploading === "doc" && <span style={{ color: "#7B4FFF" }}>· subiendo…</span>}</label>
                     <input type="file" accept="application/pdf" disabled={uploading === "doc"} onChange={e => uploadFiles(e.target.files, "doc")} />
                  </div>
               </div>

               {sectionLabel("Publicación")}
               <div className="col-md-6 d-flex align-items-center gap-4">
                  <div className="form-check"><input className="form-check-input" type="checkbox" name="published" id="pubCheck" checked={form.published} onChange={handleChange} /><label className="form-check-label" htmlFor="pubCheck">Publicada (visible en la web)</label></div>
                  <div className="form-check"><input className="form-check-input" type="checkbox" name="featured" id="featCheck" checked={form.featured} onChange={handleChange} /><label className="form-check-label" htmlFor="featCheck">Destacada</label></div>
               </div>

               <div className="col-12 mt-4 text-end">
                  <button type="submit" className="btn-nubia-sm primary" disabled={saving || !!uploading}>
                     {saving ? "Guardando…" : (propertyId ? "Guardar Cambios" : "Crear Propiedad")}
                  </button>
               </div>
            </div>
         </form>
      </div>
   )
}

export default AddPropertyBody
