import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthFromRequest } from "@/lib/auth"

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

export async function POST(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        // Generar slug simple
        const slug = body.slug || (body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now())

        const room = await prisma.room.create({
            data: {
                title: body.title,
                description: body.description,
                price: Number(body.price),
                priceHour: Number(body.priceHour) || 0,
                holder: body.holder || "Anfitrión",
                images: body.images || [],
                amenities: body.amenities || [],
                climate: body.climate || "NONE",
                slug: slug,
                rating: 5.0, // Default rating inicial
                reviews: 0
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
        })

        return NextResponse.json(room)
    } catch (error) {
        console.error("Error creating room:", error)
        return NextResponse.json({ error: "Error creating room" }, { status: 500 })
    }
}
