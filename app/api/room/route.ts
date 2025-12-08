import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { getAuthFromRequest, assertAdmin } from "@/lib/auth"

const MAX_IMAGES_PER_ROOM = 4

export async function POST(req: Request) {
  try {
    // 1. Auth + rol ADMIN
    const auth = getAuthFromRequest(req)
    assertAdmin(auth)

    // 2. Leer FormData
    const formData = await req.formData()

    const slug = String(formData.get("slug") || "").trim()
    const title = String(formData.get("title") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const price = Number(formData.get("price") || 0)
    const holder = String(formData.get("holder") || "Hotel Acuario").trim()
    const amenitiesRaw = String(formData.get("amenities") || "")

    if (!slug || !title || !description || !price) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      )
    }

    // 3. Subir imágenes a Vercel Blob (máximo 4)
    const files = formData.getAll("images") as File[]

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Debes subir al menos una imagen" },
        { status: 400 }
      )
    }

    if (files.length > MAX_IMAGES_PER_ROOM) {
      return NextResponse.json(
        {
          error: `Solo se permiten ${MAX_IMAGES_PER_ROOM} imágenes por habitación. 
Has enviado ${files.length}.`,
        },
        { status: 400 }
      )
    }

    const imageUrls: string[] = []

    for (const file of files) {
      if (!file || typeof file === "string") continue

      const blob = await put(`rooms/${Date.now()}-${file.name}`, file, {
        access: "public",
      })

      imageUrls.push(blob.url)
    }

    // 4. Parsear amenities
    const amenities = amenitiesRaw
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)

    // 5. Crear Room en Prisma
    const room = await prisma.room.create({
      data: {
        slug,
        title,
        description,
        price,
        holder,
        images: imageUrls,
        amenities,
        // rating y reviews los puedes manejar luego
      },
    })

    return NextResponse.json(room, { status: 201 })
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = (err as any).status || 500
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (err as any).message || "Error creando habitación"
    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}
