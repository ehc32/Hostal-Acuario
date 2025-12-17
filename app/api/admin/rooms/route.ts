import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthFromRequest } from "@/lib/auth"
import { ClimateType } from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(rooms)
    } catch (error) {
        console.error("Error fetching rooms:", error)
        return NextResponse.json({ error: "Error fetching rooms" }, { status: 500 })
    }
}

// Función auxiliar para generar slug único
async function generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug
    let counter = 1

    while (true) {
        const existing = await prisma.room.findUnique({
            where: { slug },
            select: { id: true }
        })

        if (!existing) {
            return slug
        }

        slug = `${baseSlug}-${counter}`
        counter++
    }
}

export async function POST(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        // Validaciones básicas
        if (!body.title) return NextResponse.json({ error: "Title is required" }, { status: 400 })
        if (!body.price) return NextResponse.json({ error: "Price is required" }, { status: 400 })

        // Generar slug base
        let baseSlug = body.slug
        if (!baseSlug) {
            baseSlug = body.title.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')

            if (baseSlug.length < 3) baseSlug += `-room`
        }

        // Asegurar que el slug sea único
        const uniqueSlug = await generateUniqueSlug(baseSlug)

        // Asegurar tipos correctos data
        const price = Number(body.price)
        const priceHour = body.priceHour ? Number(body.priceHour) : 0

        // Mapear clima
        let climate: ClimateType = ClimateType.NONE
        if (body.climate === 'AIRE') climate = ClimateType.AIRE
        if (body.climate === 'VENTILADOR') climate = ClimateType.VENTILADOR

        const r = await prisma.room.create({
            data: {
                title: body.title,
                description: body.description || "",
                price: price,
                priceHour: priceHour,
                holder: body.holder || "Anfitrión",
                images: body.images || [],
                amenities: body.amenities || [],
                climate: climate,
                slug: uniqueSlug, // Usar el slug único garantizado
                rating: 5.0,
                reviews: 0
            }
        })

        return NextResponse.json(r)
    } catch (error) {
        console.error("Error creating room FULL DETAIL:", error)
        return NextResponse.json({
            error: "Error creating room",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
