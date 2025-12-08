"use client"

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoomCard } from '@/components/room-card'
import Link from 'next/link'

export function FavoritesList() {
    const [favorites, setFavorites] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('/api/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    // La API devuelve { favorites: [ { room: { ... } }, ... ] }
                    setFavorites(data.favorites || [])
                }
            } catch (error) {
                console.error("Error fetching favorites", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [])

    const handleToggle = (roomId: number, isFavorite: boolean) => {
        if (!isFavorite) {
            setFavorites((prev) => prev.filter((item) => item.room.id !== roomId))
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
                            <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                            <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg border-dashed border-slate-200 bg-slate-50/50">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Heart className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Aún no tienes favoritos
                </h3>
                <p className="text-slate-500 max-w-sm mb-8">
                    Guarda los alojamientos que más te gusten haciendo clic en el corazón para encontrarlos fácilmente después.
                </p>
                <Button asChild>
                    <Link href="/">
                        Explorar habitaciones
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Mis Favoritos
                    <span className="ml-3 inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {favorites.length}
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((item) => {
                    const room = item.room
                    return (
                        <div key={item.id} className="h-full">
                            <RoomCard
                                id={room.slug}
                                dbId={room.id}
                                title={room.title}
                                description={room.description}
                                price={room.price}
                                rating={room.rating}
                                reviews={room.reviews}
                                images={room.images}
                                amenities={room.amenities}
                                holder={room.holder}
                                initialIsFavorite={true}
                                onAction={(isFavorite) => handleToggle(room.id, isFavorite)}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
