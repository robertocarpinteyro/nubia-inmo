"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { compressImage, prettyBytes } from "@/lib/images/compress"

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
   discountPrice: string
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
   isCollaboration: boolean
   partnerAgencyId: string
   commissionPercentage: string
   commissionSplitPercent: string
}

interface Agency {
   id: number
   name: string
}

const emptyForm: FormState = {
   title: "", description: "", propertyType: "casa", transactionType: "venta",
   price: "", discountPrice: "", currency: "MXN", address: "", city: "", state: "", zipCode: "",
   development: "", bedrooms: "", bathrooms: "", parkingSpaces: "", totalArea: "",
   builtArea: "", amenities: "", images: [], floorPlans: [], videoUrl: "",
   virtualTour: "", technicalSheetUrl: "", googleMapsUrl: "", featured: false,
   published: true, status: "available",
   isCollaboration: false, partnerAgencyId: "", commissionPercentage: "", commissionSplitPercent: "",
}

const AddPropertyBody = ({ propertyId }: { propertyId?: string }) => {
   const router = useRouter()
   const supabase = createClient()
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState("")
   const [uploading, setUploading] = useState<"images" | "floor" | "doc" | null>(null)
   const [uploadNote, setUploadNote] = useState("")
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
                  discountPrice: data.discountPrice != null ? String(data.discountPrice) : "",
                  bedrooms: data.bedrooms != null ? String(data.bedrooms) : "",
                  parkingSpaces: data.parkingSpaces != null ? String(data.parkingSpaces) : "",
                  totalArea: data.totalArea != null ? String(data.totalArea) : "",
                  builtArea: data.builtArea != null ? String(data.builtArea) : "",
                  amenities: Array.isArray(data.amenities) ? data.amenities.join(", ") : "",
                  images: Array.isArray(data.images) ? data.images : [],
                  floorPlans: Array.isArray(data.floorPlans) ? data.floorPlans : [],
                  isCollaboration: !!data.isCollaboration,
                  partnerAgencyId: data.partnerAgencyId != null ? String(data.partnerAgencyId) : "",
                  commissionPercentage: data.commissionPercentage != null ? String(data.commissionPercentage) : "",
                  commissionSplitPercent: data.commissionSplitPercent != null ? String(data.commissionSplitPercent) : "",
               }))
            }
         })
         .catch(console.error)
   }, [propertyId])

   // Inmobiliarias colaboradoras (para el selector).
   const [agencies, setAgencies] = useState<Agency[]>([])
   useEffect(() => {
      fetch("/api/admin/agencies")
         .then(r => r.json())
         .then(d => setAgencies(Array.isArray(d) ? d : []))
         .catch(() => setAgencies([]))
   }, [])

   // Documentos de colaboración (solo en edición).
   const [docs, setDocs] = useState<{ id: number; name: string; signedUrl: string | null }[]>([])
   const [docUploading, setDocUploading] = useState(false)
   const loadDocs = () => {
      if (!propertyId) return
      fetch(`/api/admin/collaboration-docs?propertyId=${propertyId}`)
         .then(r => r.json())
         .then(d => setDocs(Array.isArray(d) ? d : []))
         .catch(() => setDocs([]))
   }
   useEffect(() => { loadDocs() }, [propertyId])

   const uploadCollabDoc = async (files: FileList | null) => {
      if (!files || files.length === 0 || !propertyId) return
      setDocUploading(true)
      setError("")
      try {
         for (const file of Array.from(files)) {
            const res = await fetch("/api/uploads", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ kind: "collab", propertyId, filename: file.name }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Error al pedir URL de subida")
            const { error: upErr } = await supabase.storage
               .from(data.bucket)
               .uploadToSignedUrl(data.path, data.token, file, { contentType: file.type || undefined })
            if (upErr) throw new Error(upErr.message)
            await fetch("/api/admin/collaboration-docs", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ propertyId, name: file.name, path: data.path }),
            })
         }
         loadDocs()
      } catch (err: any) {
         setError(err.message || "Error al subir el documento")
      } finally {
         setDocUploading(false)
      }
   }

   const deleteCollabDoc = async (id: number) => {
      await fetch(`/api/admin/collaboration-docs?id=${id}`, { method: "DELETE" })
      loadDocs()
   }

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
      setUploadNote("")
      const bucketKind = kind === "doc" ? "docs" : "images"
      const compressible = kind !== "doc" // PDFs (docs) no se comprimen
      const urls: string[] = []
      const failed: string[] = []
      let savedOriginal = 0
      let savedFinal = 0
      try {
         const list = Array.from(files)
         for (let i = 0; i < list.length; i++) {
            const file = list[i]
            setUploadNote(`Subiendo ${i + 1}/${list.length}: ${file.name}…`)

            // Cada archivo se intenta de forma independiente: si uno falla,
            // los demás siguen y no se pierde lo ya subido.
            try {
               // Comprimir en el navegador antes de subir (solo imágenes).
               let uploadBlob: Blob = file
               let filename = file.name
               let contentType = file.type || "application/octet-stream"
               if (compressible) {
                  const c = await compressImage(file)
                  uploadBlob = c.blob
                  contentType = c.contentType
                  const base = file.name.replace(/\.[^./\\]+$/, "")
                  filename = `${base}.${c.ext}`
                  savedOriginal += c.originalSize
                  savedFinal += c.size
               }

               const res = await fetch("/api/uploads", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ kind: bucketKind, propertyId: propertyId || "nueva", filename }),
               })
               const data = await res.json()
               if (!res.ok) throw new Error(data.error || "Error al pedir URL de subida")
               const { error: upErr } = await supabase.storage
                  .from(data.bucket)
                  .uploadToSignedUrl(data.path, data.token, uploadBlob, { contentType })
               if (upErr) throw new Error(upErr.message)
               urls.push(data.publicUrl)

               // Persistimos incrementalmente lo que ya subió, para que un
               // corte o cierre de pestaña no borre el progreso del lote.
               if (kind === "images") setForm(prev => ({ ...prev, images: [...prev.images, data.publicUrl] }))
               else if (kind === "floor") setForm(prev => ({ ...prev, floorPlans: [...prev.floorPlans, data.publicUrl] }))
               else setForm(prev => ({ ...prev, technicalSheetUrl: data.publicUrl }))
            } catch {
               failed.push(file.name)
            }
         }

         if (compressible && savedOriginal > 0 && urls.length > 0) {
            const pct = Math.round((1 - savedFinal / savedOriginal) * 100)
            const okMsg = `${urls.length} ${urls.length === 1 ? "imagen subida" : "imágenes subidas"} y optimizadas: ${prettyBytes(savedOriginal)} → ${prettyBytes(savedFinal)} (−${pct}%)`
            setUploadNote(okMsg)
         } else {
            setUploadNote(urls.length > 0 ? `${urls.length} archivo(s) subido(s).` : "")
         }
         if (failed.length > 0) {
            setError(`No se pudieron subir ${failed.length} archivo(s): ${failed.slice(0, 3).join(", ")}${failed.length > 3 ? "…" : ""}. Vuelve a intentarlos.`)
         }
      } catch (err: any) {
         setError(err.message || "Error al subir archivos")
         setUploadNote("")
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
            discountPrice: form.discountPrice,
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
            isCollaboration: form.isCollaboration,
            partnerAgencyId: form.partnerAgencyId || null,
            commissionPercentage: form.commissionPercentage,
            commissionSplitPercent: form.commissionSplitPercent,
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
                     <label>Precio con descuento <span style={{ opacity: 0.55, fontSize: 11 }}>(opcional)</span></label>
                     <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} min="0" placeholder="0.00" />
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
                     <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>
                        Las imágenes se optimizan automáticamente (máx. 2000px, WebP) antes de subir. Puedes seleccionar varias a la vez.
                     </div>
                     {uploadNote && <div style={{ fontSize: 12, color: "#10b981", marginTop: 6 }}>{uploadNote}</div>}
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

               {sectionLabel("Colaboración")}
               <div className="col-12">
                  <div className="form-check">
                     <input className="form-check-input" type="checkbox" name="isCollaboration" id="collabCheck"
                        checked={form.isCollaboration} onChange={handleChange} />
                     <label className="form-check-label" htmlFor="collabCheck">
                        Esta propiedad es en colaboración con otra inmobiliaria
                     </label>
                  </div>
               </div>
               {form.isCollaboration && (
                  <>
                     <div className="col-md-4">
                        <div className="nubia-form-group">
                           <label>Inmobiliaria colaboradora</label>
                           <select name="partnerAgencyId" value={form.partnerAgencyId} onChange={handleChange}>
                              <option value="">— Selecciona —</option>
                              {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                           </select>
                           <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>
                              ¿No aparece? Créala en Dashboard → Colaboraciones.
                           </div>
                        </div>
                     </div>
                     <div className="col-md-4">
                        <div className="nubia-form-group">
                           <label>Comisión total (%)</label>
                           <input type="number" step="any" min="0" name="commissionPercentage"
                              value={form.commissionPercentage} onChange={handleChange} placeholder="1.5" />
                        </div>
                     </div>
                     <div className="col-md-4">
                        <div className="nubia-form-group">
                           <label>Tu parte del reparto (%)</label>
                           <input type="number" step="any" min="0" max="100" name="commissionSplitPercent"
                              value={form.commissionSplitPercent} onChange={handleChange} placeholder="50" />
                           {form.commissionPercentage && form.commissionSplitPercent && (
                              <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>
                                 Nubia recibe {((Number(form.commissionPercentage) * Number(form.commissionSplitPercent)) / 100).toFixed(3)}% del inmueble.
                              </div>
                           )}
                        </div>
                     </div>
                     <div className="col-12">
                        <div className="nubia-form-group">
                           <label>Documentos de la colaboración {docUploading && <span style={{ color: "#7B4FFF" }}>· subiendo…</span>}</label>
                           {propertyId ? (
                              <>
                                 <input type="file" accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
                                    disabled={docUploading} onChange={e => uploadCollabDoc(e.target.files)} />
                                 <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>
                                    PDF, imágenes u hojas de cálculo. Privados: solo visibles para el equipo.
                                 </div>
                                 {docs.length > 0 && (
                                    <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
                                       {docs.map(d => (
                                          <li key={d.id} className="d-flex align-items-center justify-content-between"
                                             style={{ padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                             <a href={d.signedUrl ?? "#"} target="_blank" rel="noreferrer"
                                                style={{ fontSize: 13 }}>
                                                <i className="bi bi-file-earmark-text" style={{ marginRight: 6 }}></i>{d.name}
                                             </a>
                                             <button type="button" onClick={() => deleteCollabDoc(d.id)}
                                                style={{ border: "none", background: "none", color: "#F87171", fontSize: 12, cursor: "pointer" }}>
                                                Quitar
                                             </button>
                                          </li>
                                       ))}
                                    </ul>
                                 )}
                              </>
                           ) : (
                              <div style={{ fontSize: 12, opacity: 0.6 }}>
                                 Guarda la propiedad primero para poder adjuntar documentos.
                              </div>
                           )}
                        </div>
                     </div>
                  </>
               )}

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
