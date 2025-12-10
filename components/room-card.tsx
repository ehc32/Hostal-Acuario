"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react"
import { toast } from "sonner"

interface RoomCardProps {
  id: string
  title: string
  description?: string
  price: number
  priceHour?: number
  climate?: string // Nuevo campo opcional
  rating: number
  reviews: number
  images: string[]
  amenities?: string[]
  holder?: string
  isGuestFavorite?: boolean
  dbId?: number
  initialIsFavorite?: boolean
  onAction?: (isFavorite: boolean) => void
}

export function RoomCard({
  id,
  title,
  description,
  price,
  priceHour,
  climate,
  rating,
  reviews,
  images,
  amenities = [],
  holder,
  isGuestFavorite,
  dbId,
  initialIsFavorite = false,
  onAction
}: RoomCardProps) {
  // ... (mismo estado)
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)

  const validImages = images && images.length > 0 ? images : ["/placeholder.jpg"]

  // ... (mismos handlers: nextImage, prevImage, toggleFavorite)
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!dbId) {
      console.error("No dbId provided")
      return
    }

    const previousState = isFavorite
    const newState = !isFavorite
    setIsFavorite(newState)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId: dbId }),
      })

      if (!res.ok) {
        setIsFavorite(previousState) // Revertir

        if (res.status === 401) {
          toast.error("Debes iniciar sesión", {
            description: "Inicia sesión para guardar tus favoritos.",
            action: {
              label: "Login",
              onClick: () => window.location.href = "/login"
            }
          })
        } else {
          toast.error("No se pudo actualizar favoritos")
        }
        return
      }

      const data = await res.json()
      if (data.action === 'added') {
        toast.success("Agregado a favoritos")
        onAction?.(true)
      } else {
        toast.info("Eliminado de favoritos")
        onAction?.(false)
      }

    } catch (error) {
      console.error("Error toggling favorite:", error)
      setIsFavorite(previousState)
      toast.error("Error de conexión")
    }
  }

  return (
    <Link
      href={`/habitaciones/${id}`}
      className="group block h-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full gap-2">
        {/* Image Container (mismo código) */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">

          {/* Climate Badge */}
          {climate === 'AIRE' && (
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                ❄️ Aire Acondicionado
              </span>
            </div>
          )}
          {climate === 'VENTILADOR' && (
            <div className="absolute top-3 left-3 z-20">
              <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                🌀 Ventilador
              </span>
            </div>
          )}

          {/* Guest Favorite Badge (Moved down if climate exists, or kept if not) */}
          {(isGuestFavorite || rating >= 4.8) && (
            <div className={`absolute ${climate && climate !== 'NONE' ? 'top-10' : 'top-3'} left-3 z-20`}>
              <div className="relative shadow-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm">
                  <span className="text-[12px] font-semibold text-slate-900 tracking-tight">
                    Favorito
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Image carousel */}
          <div className="relative h-full w-full">
            {validImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${title} - Foto ${index + 1}`}
                fill
                className={`object-cover transition-opacity duration-300 ${index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ))}
          </div>

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute right-3 top-3 z-10 p-2 transition-transform hover:scale-110 active:scale-95"
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={`h-6 w-6 stroke-[2px] transition-colors drop-shadow-sm ${isFavorite
                ? "fill-rose-500 stroke-rose-500"
                : "fill-black/50 stroke-white"
                }`}
            />
          </button>

          {/* Navigation arrows */}
          {isHovered && validImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md transition-all hover:bg-white hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-4 w-4 text-slate-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md transition-all hover:bg-white hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-4 w-4 text-slate-800" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {validImages.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-all shadow-sm ${index === currentImage
                    ? "bg-white w-2 opacity-100"
                    : "bg-white/60 opacity-80"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base text-slate-900 line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
              <span className="text-sm font-light">{rating.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col text-[15px] text-slate-500 font-light leading-snug">
            {holder && <p className="line-clamp-1">Anfitrión: {holder}</p>}

            {amenities && amenities.length > 0 ? (
              <p className="line-clamp-1">{amenities.slice(0, 3).join(" · ")}</p>
            ) : description ? (
              <p className="line-clamp-1">{description}</p>
            ) : null}

            <div className="mt-1.5 flex flex-wrap gap-x-3 items-baseline">
              {/* Precio Hospedaje */}
              <p className="text-slate-900">
                <span className="font-semibold">${price.toLocaleString('es-CO')}</span>
                <span className="font-light"> noche</span>
              </p>

              {/* Precio Por Rato (si existe) */}
              {priceHour && priceHour > 0 && (
                <p className="text-slate-600">
                  <span className="font-medium">${priceHour.toLocaleString('es-CO')}</span>
                  <span className="font-light text-sm"> / 3h</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}