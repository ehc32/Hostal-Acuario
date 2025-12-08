import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { rating, comment, roomId, userName, userId } = body

        if (!rating || !comment || !roomId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // 1. Crear review
        const review = await (prisma as any).review.create({
            data: {
                rating: Number(rating),
                comment,
                roomId: Number(roomId),
                userName: userName || "Anónimo",
                userId: userId ? Number(userId) : null
            }
        })

        // 2. Actualizar stats de la habitacion
        const aggregations = await (prisma as any).review.aggregate({
            where: { roomId: Number(roomId) },
            _avg: { rating: true },
            _count: { rating: true }
        })

        await prisma.room.update({
            where: { id: Number(roomId) },
            data: {
                rating: aggregations._avg.rating || 0,
                reviews: aggregations._count.rating || 0
            }
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error("Error creating review:", error)
        return NextResponse.json({ error: "Error creating review" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) return NextResponse.json([])

    try {
        const reviews = await (prisma as any).review.findMany({
            where: { roomId: Number(roomId) },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(reviews)
    } catch (error) {
        return NextResponse.json({ error: "Error fetching reviews" }, { status: 500 })
    }
}
