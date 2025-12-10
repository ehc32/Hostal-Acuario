import { RoomCard } from "./room-card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getRooms() {
  try {
    const rooms = await prisma.room.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' }
    })
    return rooms
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return []
  }
}

export async function RoomsGrid() {
  const rooms = await getRooms()
  const hasMoreRooms = rooms.length > 8
  const roomsToShow = rooms.slice(0, 8)

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-amber-600 font-medium mb-2">
            Habitaciones disponibles
          </p>

          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            Nuestras Habitaciones
          </h2>

          <p className="mt-3 text-gray-600 text-lg">
            Encuentra el espacio perfecto para tu estadía
          </p>
        </div>

        {/* GRID */}
        {rooms.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No hay habitaciones disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-15">
            {roomsToShow.map((room) => (
              <RoomCard
                key={room.id}
                id={room.slug}
                dbId={room.id}
                title={room.title}
                description={room.description}
                price={room.price}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                priceHour={(room as any).priceHour}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                climate={(room as any).climate}
                rating={room.rating}
                reviews={room.reviews}
                images={room.images}
                amenities={room.amenities}
                holder={room.holder}
              />
            ))}
          </div>
        )}

        {/* BOTÓN VER MÁS */}
        {hasMoreRooms && (
          <div className="flex justify-center mt-12">
            <Link
              href="/habitaciones"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 
              text-white font-medium px-6 py-3 rounded-full transition"
            >
              Ver más habitaciones
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}

      </div>
    </section>
  )
}
