// Compresión de imágenes del lado del cliente (navegador).
// Redimensiona al lado mayor <= maxDim y re-exporta en WebP (fallback JPEG),
// para que a Supabase Storage sólo suba una versión ligera (~200-450 KB)
// en lugar del original de cámara (~8-12 MB).

export interface CompressResult {
   blob: Blob
   ext: string
   contentType: string
   /** Peso original en bytes (para telemetría/UI). */
   originalSize: number
   /** Peso final en bytes. */
   size: number
}

export interface CompressOptions {
   /** Lado mayor máximo en píxeles. Default 2000. */
   maxDim?: number
   /** Calidad 0-1 para WebP/JPEG. Default 0.82. */
   quality?: number
}

const COMPRESSIBLE = new Set(["image/jpeg", "image/png", "image/webp"])

/**
 * Comprime una imagen en el navegador. Si el archivo no es una imagen
 * rasterizada compatible (p. ej. SVG, HEIC no decodificable, o ya es
 * muy pequeña), devuelve el archivo original sin tocarlo.
 */
export async function compressImage(file: File, opts: CompressOptions = {}): Promise<CompressResult> {
   const maxDim = opts.maxDim ?? 2000
   const quality = opts.quality ?? 0.82
   const originalSize = file.size

   const passthrough = (): CompressResult => {
      const ext = /\.([a-zA-Z0-9]+)$/.exec(file.name)?.[1]?.toLowerCase() || "bin"
      return { blob: file, ext, contentType: file.type || "application/octet-stream", originalSize, size: originalSize }
   }

   // Solo comprimimos rasters conocidos. SVG/HEIC/etc. pasan tal cual.
   if (!COMPRESSIBLE.has(file.type)) return passthrough()

   // Sin APIs de canvas (SSR) no hacemos nada.
   if (typeof document === "undefined" || typeof createImageBitmap === "undefined") return passthrough()

   let bitmap: ImageBitmap
   try {
      // imageOrientation respeta la rotación EXIF de las fotos de celular/cámara.
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" as any })
   } catch {
      return passthrough()
   }

   const { width, height } = bitmap
   const scale = Math.min(1, maxDim / Math.max(width, height))
   const w = Math.round(width * scale)
   const h = Math.round(height * scale)

   const canvas = document.createElement("canvas")
   canvas.width = w
   canvas.height = h
   const ctx = canvas.getContext("2d")
   if (!ctx) {
      bitmap.close?.()
      return passthrough()
   }
   ctx.drawImage(bitmap, 0, 0, w, h)
   bitmap.close?.()

   const toBlob = (type: string, q: number) =>
      new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, q))

   // Preferimos WebP; si el navegador no lo soporta, JPEG.
   let blob = await toBlob("image/webp", quality)
   let contentType = "image/webp"
   let ext = "webp"
   if (!blob || blob.type !== "image/webp") {
      blob = await toBlob("image/jpeg", quality)
      contentType = "image/jpeg"
      ext = "jpg"
   }

   if (!blob) return passthrough()

   // Si por lo que sea la "comprimida" salió más pesada que el original
   // (imágenes ya optimizadas y pequeñas), nos quedamos con el original.
   if (blob.size >= originalSize) return passthrough()

   return { blob, ext, contentType, originalSize, size: blob.size }
}

/** Formatea bytes a texto legible (KB/MB). */
export function prettyBytes(n: number): string {
   if (n < 1024) return `${n} B`
   if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
   return `${(n / 1024 / 1024).toFixed(1)} MB`
}
