import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthFromRequest } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        console.log("[API Favorites GET] Auth check:", auth)

        if (!auth) {
            console.log("[API Favorites GET] Unauthorized/No token")
            return NextResponse.json({ favorites: [] })
        }

        const favorites = await (prisma as any).favorite.findMany({
            where: { userId: auth.userId },
            include: {
                room: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log(`[API Favorites GET] Found ${favorites.length} favorites for UserID: ${auth.userId}`)

        return NextResponse.json({
            favorites: favorites
        })
    } catch (error) {
        console.error("[API Favorites GET] Error:", error)
        return NextResponse.json({ error: "Error fetching favorites" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        console.log("[API Favorites POST] Auth check:", auth)

        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { roomId } = body

        console.log(`[API Favorites POST] UserID: ${auth.userId} toggling RoomID: ${roomId}`)

        if (!roomId) {
            return NextResponse.json({ error: "Room ID required" }, { status: 400 })
        }

        const existing = await (prisma as any).favorite.findUnique({
            where: {
                userId_roomId: {
                    userId: auth.userId,
                    roomId: Number(roomId)
                }
            }
        })

        if (existing) {
            await (prisma as any).favorite.delete({
                where: { id: existing.id }
            })
            console.log(`[API Favorites POST] Removed favorite ID: ${existing.id}`)
            return NextResponse.json({ action: 'removed' })
        } else {
            const newFav = await (prisma as any).favorite.create({
                data: {
                    userId: auth.userId,
                    roomId: Number(roomId)
                }
            })
            console.log(`[API Favorites POST] Created favorite ID: ${newFav.id}`)
            return NextResponse.json({ action: 'added' })
        }

    } catch (error) {
        console.error("[API Favorites POST] Error:", error)
        return NextResponse.json({ error: "Error toggling favorite" }, { status: 500 })
    }
}
