import { prisma } from "@/lib/prisma"
import { RoomsGridClient } from "./rooms-grid-client"

async function getRooms() {
  try {
    const rooms = await prisma.room.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' } // O 'asc' si prefieren orden específico
    })

    // Serializar completamente para evitar errores de Client Component
    return JSON.parse(JSON.stringify(rooms))
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return []
  }
}

export async function RoomsGrid() {
  const rooms = await getRooms()

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

        {/* CLIENT GRID & PAGINATION */}
        <RoomsGridClient rooms={rooms} />

      </div>
    </section>
  )
}
