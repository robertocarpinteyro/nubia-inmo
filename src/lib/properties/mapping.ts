import type { PropertyRow } from "@/types/supabase"

// ── Catálogos de mapeo UI(es) <-> DB ──────────────────────────────
// La tabla `properties` guarda `type` y `operation_type` en inglés
// (apartment/house/land/...) porque así lo consume el bot de WhatsApp.
// El dashboard y la web trabajan en español; aquí está el puente.

export const TYPE_ES_TO_DB: Record<string, string> = {
  casa: "house",
  departamento: "apartment",
  terreno: "land",
  oficina: "office",
  local: "commercial",
  lote: "lot",
}

export const TYPE_DB_TO_ES: Record<string, string> = {
  house: "casa",
  apartment: "departamento",
  land: "terreno",
  office: "oficina",
  commercial: "local",
  lot: "lote",
}

export const OPERATION_ES_TO_DB: Record<string, string> = {
  venta: "sale",
  renta: "rent",
}

export const OPERATION_DB_TO_ES: Record<string, string> = {
  sale: "venta",
  rent: "renta",
}

// ── Forma del formulario del dashboard ────────────────────────────
export interface PropertyFormPayload {
  title: string
  description?: string
  propertyType: string // es
  transactionType: string // es
  price: number | string
  currency?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  development?: string
  neighborhood?: string
  bedrooms?: number | string
  bathrooms?: number | string // admite "3 1/2"
  halfBathrooms?: number | string
  parkingSpaces?: number | string
  totalArea?: number | string
  builtArea?: number | string
  subtype?: string
  propertyCondition?: string
  status?: string
  published?: boolean
  featured?: boolean
  petFriendly?: boolean
  amenities?: string[]
  images?: string[] // mediaUrls
  floorPlans?: string[]
  videoUrl?: string
  virtualTour?: string
  technicalSheetUrl?: string
  googleMapsUrl?: string // -> map_embed_url
}

// ── Helpers ───────────────────────────────────────────────────────
const num = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const intOrNull = (v: unknown): number | null => {
  const n = num(v)
  return n === null ? null : Math.trunc(n)
}

/** Parsea "3 1/2", "3.5", "3½" -> { full: 3, half: 1 } */
export function parseBathrooms(value: unknown): { full: number | null; half: number | null } {
  if (value === null || value === undefined || value === "") return { full: null, half: null }
  const s = String(value).trim()
  const hasHalf = /½|1\/2|\.5\b/.test(s) || (Number(s) % 1 === 0.5)
  const full = parseInt(s, 10)
  return {
    full: Number.isFinite(full) ? full : null,
    half: hasHalf ? 1 : null,
  }
}

/** Genera un property_id legible y único a partir del nombre. */
export function slugifyPropertyId(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  const suffix = Math.random().toString(36).slice(2, 7)
  return base ? `${base}-${suffix}` : `prop-${suffix}`
}

const cleanArr = (a?: string[]): string[] =>
  Array.isArray(a) ? a.map((s) => String(s).trim()).filter(Boolean) : []

// ── Form -> DB ────────────────────────────────────────────────────
/** Construye el payload de columnas de `properties` desde el formulario. */
export function formToDbColumns(form: PropertyFormPayload, isUpdate = false) {
  const { full: bathFull, half: bathHalf } = parseBathrooms(form.bathrooms)

  const location: Record<string, unknown> = {}
  if (form.city) location.city = form.city
  if (form.state) location.state = form.state
  if (form.zipCode) location.zip = form.zipCode
  if (form.development) location.development = form.development
  if (form.neighborhood) location.neighborhood = form.neighborhood

  const area: Record<string, unknown> = {}
  const total = num(form.totalArea)
  const built = num(form.builtArea)
  if (total !== null) area.total = total
  if (built !== null) area.built = built

  const columns: Record<string, unknown> = {
    name: form.title,
    description: form.description ?? null,
    type: TYPE_ES_TO_DB[form.propertyType] ?? form.propertyType,
    operation_type: OPERATION_ES_TO_DB[form.transactionType] ?? form.transactionType,
    price: num(form.price),
    currency: form.currency || "MXN",
    location,
    area,
    address: form.address ?? null,
    bedrooms: intOrNull(form.bedrooms),
    bathrooms: bathFull,
    half_bathrooms: form.halfBathrooms !== undefined ? intOrNull(form.halfBathrooms) : bathHalf,
    parking_spots: intOrNull(form.parkingSpaces),
    subtype: form.subtype ?? null,
    property_condition: form.propertyCondition ?? null,
    amenities: cleanArr(form.amenities),
    images: cleanArr(form.images),
    floor_plans: cleanArr(form.floorPlans),
    video_url: form.videoUrl || null,
    virtual_tour: form.virtualTour || null,
    technical_sheet_url: form.technicalSheetUrl || null,
    map_embed_url: form.googleMapsUrl || null,
    featured: !!form.featured,
    pet_friendly: form.petFriendly ?? null,
    published: form.published ?? true,
    status: form.status || "available",
    updated_at: new Date().toISOString(),
  }

  if (!isUpdate) {
    columns.property_id = slugifyPropertyId(form.title || "propiedad")
  }

  // Elimina claves undefined (no null) para no pisar columnas en UPDATE
  Object.keys(columns).forEach((k) => columns[k] === undefined && delete columns[k])
  return columns
}

// ── DB -> Form (para edición) ─────────────────────────────────────
export function dbRowToForm(row: PropertyRow) {
  const loc = (row.location ?? {}) as Record<string, any>
  const area = (row.area ?? {}) as Record<string, any>
  const bathrooms =
    row.bathrooms != null
      ? row.half_bathrooms
        ? `${row.bathrooms} 1/2`
        : String(row.bathrooms)
      : ""
  return {
    title: row.name ?? "",
    description: row.description ?? "",
    propertyType: TYPE_DB_TO_ES[row.type] ?? row.type ?? "casa",
    transactionType: OPERATION_DB_TO_ES[row.operation_type ?? ""] ?? "venta",
    price: row.price != null ? String(row.price) : "",
    currency: row.currency ?? "MXN",
    address: row.address ?? "",
    city: loc.city ?? "",
    state: loc.state ?? "",
    zipCode: loc.zip ?? "",
    development: loc.development ?? "",
    neighborhood: loc.neighborhood ?? "",
    bedrooms: row.bedrooms != null ? String(row.bedrooms) : "",
    bathrooms,
    parkingSpaces: row.parking_spots != null ? String(row.parking_spots) : "",
    totalArea: area.total != null ? String(area.total) : "",
    builtArea: area.built != null ? String(area.built) : "",
    subtype: row.subtype ?? "",
    propertyCondition: row.property_condition ?? "",
    status: row.status ?? "available",
    published: row.published ?? true,
    featured: row.featured ?? false,
    petFriendly: row.pet_friendly ?? false,
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    floorPlans: row.floor_plans ?? [],
    videoUrl: row.video_url ?? "",
    virtualTour: row.virtual_tour ?? "",
    technicalSheetUrl: row.technical_sheet_url ?? "",
    googleMapsUrl: row.map_embed_url ?? "",
  }
}

// ── DB -> Catálogo público (vista normalizada) ────────────────────
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
  const loc = (row.location ?? {}) as Record<string, any>
  const area = (row.area ?? {}) as Record<string, any>
  const images = row.images ?? []
  return {
    id: row.id,
    propertyId: row.property_id,
    title: row.name,
    description: row.description,
    type: TYPE_DB_TO_ES[row.type] ?? row.type,
    operation: OPERATION_DB_TO_ES[row.operation_type ?? ""] ?? row.operation_type ?? "",
    price: row.price,
    currency: row.currency ?? "MXN",
    city: loc.city ?? null,
    state: loc.state ?? null,
    development: loc.development ?? null,
    address: row.address,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parkingSpaces: row.parking_spots,
    area: area.total ?? null,
    images,
    thumb: images[0] ?? null,
    floorPlans: row.floor_plans ?? [],
    videoUrl: row.video_url,
    virtualTour: row.virtual_tour,
    technicalSheetUrl: row.technical_sheet_url,
    mapEmbedUrl: row.map_embed_url,
    amenities: row.amenities ?? [],
    featured: row.featured ?? false,
    status: row.status,
  }
}
