"use client"

import { useState } from "react"
import { RoomCard } from "./room-card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
// import { ClimateType } from "@prisma/client"

type ClimateType = "AIRE" | "VENTILADOR" | "NONE"

interface RoomWithDetails {
    id: number
    slug: string
    title: string
    description: string
    price: number
    priceHour: number
    climate: ClimateType | string // Permitir string para máxima compatibilidad
    rating: number
    reviews: number
    images: string[]
    amenities: string[]
    holder: string
}

interface RoomsGridClientProps {
    rooms: RoomWithDetails[]
}

export function RoomsGridClient({ rooms }: RoomsGridClientProps) {
    const [visibleCount, setVisibleCount] = useState(8)

    const visibleRooms = rooms.slice(0, visibleCount)
    const hasMore = visibleCount < rooms.length

    const handleLoadMore = () => {
        setVisibleCount(rooms.length) // Mostrar todas las restantes 
        // O si prefiere de 8 en 8: setVisibleCount(prev => prev + 8)
    }

    if (rooms.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>No hay habitaciones disponibles en este momento.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {visibleRooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        id={room.slug}
                        dbId={room.id}
                        title={room.title}
                        description={room.description}
                        price={room.price}
                        priceHour={room.priceHour}
                        climate={room.climate}
                        rating={room.rating}
                        reviews={room.reviews}
                        images={room.images}
                        amenities={room.amenities}
                        holder={room.holder}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-12 animate-in fade-in zoom-in duration-300">
                    <Button
                        onClick={handleLoadMore}
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        Ver más habitaciones
                        <ChevronDown className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </>
    )
}
