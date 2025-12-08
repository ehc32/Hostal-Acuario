import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ReservationStatus } from "@prisma/client"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const reservationId = parseInt(id)

        if (isNaN(reservationId)) {
            return NextResponse.json(
                { error: "ID de reserva inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { status } = body

        // Validar que el status sea válido usando el enum de Prisma
        const validStatuses = Object.values(ReservationStatus)
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Estado inválido", validStatuses },
                { status: 400 }
            )
        }

        // Actualizar la reserva
        const updatedReservation = await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: status as ReservationStatus }
        })

        return NextResponse.json(updatedReservation)
    } catch (error) {
        console.error("Error updating reservation:", error)
        return NextResponse.json(
            { error: "Error al actualizar la reserva", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const reservationId = parseInt(id)

        if (isNaN(reservationId)) {
            return NextResponse.json(
                { error: "ID de reserva inválido" },
                { status: 400 }
            )
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: {
                user: true,
                room: true
            }
        })

        if (!reservation) {
            return NextResponse.json(
                { error: "Reserva no encontrada" },
                { status: 404 }
            )
        }

        return NextResponse.json(reservation)
    } catch (error) {
        console.error("Error fetching reservation:", error)
        return NextResponse.json(
            { error: "Error al obtener la reserva" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const reservationId = parseInt(id)

        if (isNaN(reservationId)) {
            return NextResponse.json(
                { error: "ID de reserva inválido" },
                { status: 400 }
            )
        }

        // Eliminar la reserva
        await prisma.reservation.delete({
            where: { id: reservationId }
        })

        return NextResponse.json({ success: true, message: "Reserva eliminada" })
    } catch (error) {
        console.error("Error deleting reservation:", error)
        return NextResponse.json(
            { error: "Error al eliminar la reserva", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
