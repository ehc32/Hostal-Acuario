import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    request: Request,
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

        await prisma.reservation.delete({
            where: { id: reservationId },
        })

        return NextResponse.json({ message: "Reserva eliminada exitosamente" })
    } catch (error) {
        console.error("Error deleting reservation:", error)
        return NextResponse.json(
            { error: "Error al eliminar la reserva" },
            { status: 500 }
        )
    }
}
