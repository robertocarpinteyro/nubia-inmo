import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabase, requireStaff } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const BUCKETS = {
  images: "property-images",
  docs: "property-docs",
} as const

const extFromName = (name: string) => {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name || "")
  return m ? m[1].toLowerCase() : "bin"
}

const uuid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2) + Date.now().toString(36))

/**
 * POST /api/uploads
 * Body: { kind: "images" | "docs", propertyId?: string, filename: string }
 * Devuelve una signed upload URL (Storage) + la URL pública resultante.
 * El cliente sube el archivo directo a `signedUrl` y luego guarda `publicUrl`
 * en la columna correspondiente vía PATCH /api/properties/[id].
 */
export async function POST(req: NextRequest) {
  const session = await requireStaff()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const kind: keyof typeof BUCKETS = body.kind === "docs" ? "docs" : "images"
  const bucket = BUCKETS[kind]
  const filename = String(body.filename || "file")
  const folder = String(body.propertyId || "_unassigned").replace(/[^a-zA-Z0-9_-]/g, "-")
  const path = `${folder}/${uuid()}.${extFromName(filename)}`

  const admin = createAdminSupabase()
  const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(path)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const {
    data: { publicUrl },
  } = admin.storage.from(bucket).getPublicUrl(path)

  return NextResponse.json({
    bucket,
    path,
    token: data.token,
    signedUrl: data.signedUrl,
    publicUrl,
  })
}
