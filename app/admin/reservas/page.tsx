import { prisma } from "@/lib/prisma"
import { DataTable } from "./data-table"
import { columns, ReservationColumn } from "./columns"

export default async function ReservasPage() {
    // Cast a 'any' para evitar conflictos con tipos desactualizados
    const reservations = await (prisma as any).reservation.findMany({
        include: {
            room: { select: { title: true } },
            user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    const formattedReservations: ReservationColumn[] = reservations.map((res: any) => ({
        id: res.id,
        roomTitle: res.room.title,
        userName: res.user?.name || res.user?.email || "Anónimo",
        checkIn: res.checkIn || res.startDate || new Date(), // Fallback de nombres
        checkOut: res.checkOut || res.endDate || new Date(),
        status: res.status,
        total: res.total || 0
    }))

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Reservas</h2>
                <p className="text-muted-foreground">Administra todas las reservas del sistema.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <DataTable columns={columns} data={formattedReservations} />
            </div>
        </div>
    )
}
