import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthFromRequest } from "@/lib/auth"
import { ClimateType } from "@prisma/client"

type Params = {
    params: Promise<{ id: string }>
}

export async function GET(req: Request, props: Params) {
    try {
        const params = await props.params
        const id = Number(params.id)

        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

        const room = await prisma.room.findUnique({
            where: { id }
        })

        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })

        return NextResponse.json(room)
    } catch (error) {
        console.error("Error fetching room:", error)
        return NextResponse.json({ error: "Error fetching room" }, { status: 500 })
    }
}

export async function PUT(req: Request, props: Params) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const params = await props.params
        const id = Number(params.id)
        const body = await req.json()

        // Mapear clima correctamente
        let climate: ClimateType = ClimateType.NONE
        if (body.climate === 'AIRE') climate = ClimateType.AIRE
        if (body.climate === 'VENTILADOR') climate = ClimateType.VENTILADOR
        if (body.climate === 'NONE') climate = ClimateType.NONE

        const room = await prisma.room.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                price: Number(body.price),
                priceHour: body.priceHour ? Number(body.priceHour) : 0,
                climate: climate,
                images: body.images,
                amenities: body.amenities,
                holder: body.holder
            }
        })

        return NextResponse.json(room)
    } catch (error) {
        console.error("Error updating room:", error)
        return NextResponse.json({ error: "Error updating room" }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: Params) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const params = await props.params
        const id = Number(params.id)

        // Eliminar dependencias antes de borrar la habitación para evitar errores de Foreign Key
        await prisma.$transaction([
            prisma.reservation.deleteMany({ where: { roomId: id } }),
            prisma.review.deleteMany({ where: { roomId: id } }),
            prisma.favorite.deleteMany({ where: { roomId: id } }),
            prisma.room.delete({ where: { id } })
        ])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting room:", error)
        return NextResponse.json({ error: "Error deleting room" }, { status: 500 })
    }
}
