"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RoomCard } from "@/components/room-card"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingScreen } from "@/components/loading-screen"
import { Heart } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function FavoritosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          console.log('Favorites data:', data)
          setRooms(data.favorites || [])
        }
      } catch (error) {
        console.error("Error cargando favoritos", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push("/login")
        return
      }
      fetchFavorites()
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return <LoadingScreen title="Cargando Favoritos" description="Obteniendo tus habitaciones guardadas..." />
  }

  if (!user) return null // Redireccionando...

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">

        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Favoritos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <Heart />
              Mis Favoritos
            </h1>
            <p className="text-muted-foreground mt-2">
              Tus habitaciones guardadas para tu próxima estadía.
            </p>
          </div>
          <div className="bg-amber-50 text-amber-900 px-4 py-2 rounded-full font-medium">
            {rooms.length} {rooms.length === 1 ? 'Habitación' : 'Habitaciones'}
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Aún no tienes favoritos</h2>
            <p className="text-gray-500 mt-2 mb-6">Explora nuestra colección y guarda lo que te guste.</p>
            <button
              onClick={() => router.push("/#habitaciones")}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Ver Habitaciones
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((favorite) => (
              <RoomCard
                key={favorite.room.id}
                id={favorite.room.slug} // Url slug
                dbId={favorite.room.id} // Numeric ID
                title={favorite.room.title}
                description={favorite.room.description}
                price={favorite.room.price}
                rating={favorite.room.rating}
                reviews={favorite.room.reviews}
                images={favorite.room.images}
                amenities={favorite.room.amenities}
                holder={favorite.room.holder}
                initialIsFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
