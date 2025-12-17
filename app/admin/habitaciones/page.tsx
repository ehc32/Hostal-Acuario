import { prisma } from "@/lib/prisma"
import { DataTable } from "./data-table"
import { columns, RoomColumn } from "./columns"

export const dynamic = 'force-dynamic'

export default async function HabitacionesPage() {
    const rooms = await prisma.room.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const formattedRooms: RoomColumn[] = rooms.map((room) => ({
        id: room.id,
        title: room.title,
        slug: room.slug,
        price: room.price,
        priceHour: room.priceHour,
        climate: room.climate,
        rating: room.rating,
        images: room.images
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Habitaciones</h1>
                <p className="text-slate-500 mt-1">
                    Administra las habitaciones disponibles, precios y fotos.
                </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <DataTable columns={columns} data={formattedRooms} />
            </div>
        </div>
    )
}
