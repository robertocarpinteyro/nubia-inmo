// ── Puente entre el formulario/web (UI) y la tabla `properties` de la Base A ──
// La Base A (proyecto de producción) usa un esquema Sequelize con enums en
// español y columnas planas (no jsonb). El frontend trabaja con los contratos
// estables `PropertyFormPayload` (formulario) y `PublicProperty` (catálogo);
// aquí está toda la traducción hacia/desde las columnas reales.

// ── Forma cruda de una fila de public.properties (Base A) ─────────────
// Escrita a mano para no depender del tipo Database generado (que aún
// describe otro proyecto). Solo las columnas que consumimos.
export interface PropertyRow {
  id: number
  title: string
  titleEn: string | null
  description: string | null
  propertyType: string // casa | departamento | terreno | oficina | local
  transactionType: string // venta | renta
  price: number | string | null
  discountPrice: number | string | null
  currency: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  bedrooms: number | null
  bathrooms: string | null // varchar, admite "3 1/2"
  parkingSpaces: number | null
  totalArea: number | string | null
  builtArea: number | string | null
  yearBuilt: number | null
  status: string | null // disponible | vendida | rentada | en_proceso
  featured: boolean | null
  createdBy: number | null
  createdAt: string | null
  updatedAt: string | null
  videoUrl: string | null
  googleMapsUrl: string | null
  technicalSheet: string | null
  // Columnas agregadas para el dashboard (ver supabase/migrations/0001):
  published: boolean | null
  images: string[] | null
  floorPlans: string[] | null
  amenities: string[] | null
  development: string | null
  virtualTour: string | null
}

// ── Catálogos de mapeo UI(es) <-> DB(es) ──────────────────────────────
// La DB ya guarda los enums en español; el único ajuste es "lote" (que el
// formulario ofrece) → "terreno" (valor real del enum), y el estado.

export const PTYPE_FORM_TO_DB: Record<string, string> = {
  casa: "casa",
  departamento: "departamento",
  terreno: "terreno",
  lote: "terreno",
  oficina: "oficina",
  local: "local",
}

export const STATUS_FORM_TO_DB: Record<string, string> = {
  available: "disponible",
  sold: "vendida",
  rented: "rentada",
  reserved: "en_proceso",
}

export const STATUS_DB_TO_FORM: Record<string, string> = {
  disponible: "available",
  vendida: "sold",
  rentada: "rented",
  en_proceso: "reserved",
}

// ── Forma del formulario del dashboard (contrato estable) ─────────────
export interface PropertyFormPayload {
  title: string
  description?: string
  propertyType: string // es
  transactionType: string // es (venta | renta)
  price: number | string
  currency?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  development?: string
  bedrooms?: number | string
  bathrooms?: number | string // admite "3 1/2"
  parkingSpaces?: number | string
  totalArea?: number | string
  builtArea?: number | string
  status?: string
  published?: boolean
  featured?: boolean
  amenities?: string[]
  images?: string[]
  floorPlans?: string[]
  videoUrl?: string
  virtualTour?: string
  technicalSheetUrl?: string
  googleMapsUrl?: string
}

// ── Helpers ───────────────────────────────────────────────────────────
const num = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const intOrNull = (v: unknown): number | null => {
  const n = num(v)
  return n === null ? null : Math.trunc(n)
}

/** "2 1/2" | "2½" | "2.5" -> 2.5 ; "3" -> 3 ; vacío -> null */
export function bathroomsToNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null
  const s = String(value).trim()
  const hasHalf = /½|1\/2/.test(s) || Number(s) % 1 === 0.5
  const full = parseInt(s, 10)
  if (!Number.isFinite(full)) return hasHalf ? 0.5 : null
  return full + (hasHalf ? 0.5 : 0)
}

const cleanArr = (a?: string[]): string[] =>
  Array.isArray(a) ? a.map((s) => String(s).trim()).filter(Boolean) : []

// ── Form -> columnas de la DB (Base A) ────────────────────────────────
export function formToDbColumns(form: PropertyFormPayload, isUpdate = false) {
  const columns: Record<string, unknown> = {
    title: form.title,
    description: form.description ?? null,
    propertyType: PTYPE_FORM_TO_DB[form.propertyType] ?? form.propertyType,
    transactionType: form.transactionType === "renta" ? "renta" : "venta",
    // price es NOT NULL en la Base A; 0 como red de seguridad (la ruta valida).
    price: num(form.price) ?? 0,
    currency: form.currency || "MXN",
    address: form.address ?? null,
    city: form.city ?? null,
    state: form.state ?? null,
    zipCode: form.zipCode ?? null,
    development: form.development ?? null,
    bedrooms: intOrNull(form.bedrooms),
    bathrooms: form.bathrooms ? String(form.bathrooms).trim() : null,
    parkingSpaces: intOrNull(form.parkingSpaces),
    totalArea: num(form.totalArea),
    builtArea: num(form.builtArea),
    status: STATUS_FORM_TO_DB[form.status ?? ""] ?? "disponible",
    featured: !!form.featured,
    published: form.published ?? true,
    amenities: cleanArr(form.amenities),
    images: cleanArr(form.images),
    floorPlans: cleanArr(form.floorPlans),
    virtualTour: form.virtualTour || null,
    videoUrl: form.videoUrl || null,
    technicalSheet: form.technicalSheetUrl || null,
    googleMapsUrl: form.googleMapsUrl || null,
    updatedAt: new Date().toISOString(),
  }

  if (!isUpdate) {
    columns.createdAt = new Date().toISOString()
    // createdBy lo fija la ruta con el id del usuario de la sesión.
  }

  // Quita undefined (no null) para no pisar columnas en UPDATE.
  Object.keys(columns).forEach((k) => columns[k] === undefined && delete columns[k])
  return columns
}

// ── DB -> Form (para edición) ─────────────────────────────────────────
export function dbRowToForm(row: PropertyRow) {
  return {
    title: row.title ?? "",
    description: row.description ?? "",
    propertyType: row.propertyType ?? "casa",
    transactionType: row.transactionType ?? "venta",
    price: row.price != null ? String(row.price) : "",
    currency: row.currency ?? "MXN",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    zipCode: row.zipCode ?? "",
    development: row.development ?? "",
    bedrooms: row.bedrooms != null ? String(row.bedrooms) : "",
    bathrooms: row.bathrooms ?? "",
    parkingSpaces: row.parkingSpaces != null ? String(row.parkingSpaces) : "",
    totalArea: row.totalArea != null ? String(row.totalArea) : "",
    builtArea: row.builtArea != null ? String(row.builtArea) : "",
    status: STATUS_DB_TO_FORM[row.status ?? ""] ?? "available",
    published: row.published ?? true,
    featured: row.featured ?? false,
    // El formulario recibe amenities como array y lo une a texto él mismo.
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    floorPlans: row.floorPlans ?? [],
    videoUrl: row.videoUrl ?? "",
    virtualTour: row.virtualTour ?? "",
    technicalSheetUrl: row.technicalSheet ?? "",
    googleMapsUrl: row.googleMapsUrl ?? "",
  }
}

// ── DB -> Catálogo público (contrato estable que consume la web) ──────
export interface PublicProperty {
  id: string
  propertyId: string
  title: string
  description: string | null
  type: string // es
  operation: string // es
  price: number | null
  currency: string
  city: string | null
  state: string | null
  development: string | null
  address: string | null
  bedrooms: number | null
  bathrooms: number | null
  parkingSpaces: number | null
  area: number | null
  images: string[]
  thumb: string | null
  floorPlans: string[]
  videoUrl: string | null
  virtualTour: string | null
  technicalSheetUrl: string | null
  mapEmbedUrl: string | null
  amenities: string[]
  featured: boolean
  status: string | null
}

export function rowToPublic(row: PropertyRow): PublicProperty {
  const images = row.images ?? []
  return {
    id: String(row.id),
    propertyId: String(row.id),
    title: row.title,
    description: row.description,
    type: row.propertyType,
    operation: row.transactionType ?? "",
    price: num(row.price),
    currency: row.currency ?? "MXN",
    city: row.city,
    state: row.state,
    development: row.development,
    address: row.address,
    bedrooms: row.bedrooms,
    bathrooms: bathroomsToNumber(row.bathrooms),
    parkingSpaces: row.parkingSpaces,
    area: num(row.totalArea),
    images,
    thumb: images[0] ?? null,
    floorPlans: row.floorPlans ?? [],
    videoUrl: row.videoUrl,
    virtualTour: row.virtualTour,
    technicalSheetUrl: row.technicalSheet,
    mapEmbedUrl: row.googleMapsUrl,
    amenities: row.amenities ?? [],
    featured: row.featured ?? false,
    status: STATUS_DB_TO_FORM[row.status ?? ""] ?? row.status,
  }
}
