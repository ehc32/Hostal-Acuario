"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Star, VenetianMask, Wind } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RoomCardProps {
  id: string
  title: string
  description?: string
  price: number
  priceHour?: number
  climate?: string
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
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)

  const validImages = images && images.length > 0 ? images : ["/placeholder.jpg"]

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
        setIsFavorite(previousState)

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
      <div className="flex flex-col h-full gap-3">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all group-hover:shadow-md">

          {/* Badges Container - Stacked automatically */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
            {climate === 'AIRE' && (
              <Badge variant="secondary" className="bg-blue-50/90 hover:bg-blue-100 text-blue-700 backdrop-blur-sm border-blue-200">
                <Wind className="w-3 h-3 mr-1" /> Aire Acondicionado
              </Badge>
            )}
            {climate === 'VENTILADOR' && (
              <Badge variant="secondary" className="bg-orange-50/90 hover:bg-orange-100 text-orange-700 backdrop-blur-sm border-orange-200">
                <VenetianMask className="w-3 h-3 mr-1" /> Ventilador
              </Badge>
            )}

            {(isGuestFavorite || rating >= 4.8) && (
              <Badge variant="secondary" className="bg-white/90 hover:bg-white text-slate-900 backdrop-blur-md shadow-sm border-white/50">
                <Heart className="w-3 h-3 mr-1 text-red-500 fill-red-500" /> Favorito
              </Badge>
            )}
          </div>

          {/* Image carousel */}
          <div className="relative h-full w-full">
            {validImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${title} - Foto ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  index === currentImage ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ))}
          </div>

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute right-3 top-3 z-10 p-2 rounded-full transition-all hover:scale-110 active:scale-95 hover:bg-black/10 backdrop-blur-[2px]"
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn(
                "h-6 w-6 stroke-[2px] transition-colors drop-shadow-md",
                isFavorite
                  ? "fill-rose-500 stroke-rose-500"
                  : "fill-black/40 stroke-white"
              )}
            />
          </button>

          {/* Navigation arrows */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-between px-2 pointer-events-none transition-opacity duration-200",
            isHovered && validImages.length > 1 ? "opacity-100" : "opacity-0"
          )}>
            <button
              onClick={prevImage}
              className="pointer-events-auto rounded-full bg-white/90 p-1.5 shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4 text-slate-800" />
            </button>
            <button
              onClick={nextImage}
              className="pointer-events-auto rounded-full bg-white/90 p-1.5 shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4 text-slate-800" />
            </button>
          </div>

          {/* Dots indicator */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {validImages.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all shadow-sm backdrop-blur-[2px]",
                    index === currentImage
                      ? "bg-white w-3 opacity-100"
                      : "bg-white/60 w-1.5 opacity-80 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="flex flex-col gap-1.5 px-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[17px] text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
              <span className="text-sm font-medium text-slate-900">{rating.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col text-[15px] text-slate-500 font-light leading-snug">
            {holder && <p className="line-clamp-1">Anfitrión: {holder}</p>}

            {amenities && amenities.length > 0 ? (
              <p className="line-clamp-1 text-slate-400">{amenities.slice(0, 3).join(" · ")}</p>
            ) : description ? (
              <p className="line-clamp-1 text-slate-400">{description}</p>
            ) : null}

            <div className="mt-2 flex flex-wrap gap-x-3 items-baseline">
              {/* Precio Hospedaje */}
              <p className="text-slate-900 flex items-baseline gap-1">
                <span className="font-bold text-lg">${price.toLocaleString('es-CO')}</span>
                <span className="font-light text-slate-600">noche</span>
              </p>

              {/* Precio Por Rato (si existe) */}
              {priceHour && priceHour > 0 && (
                <div className="flex items-center gap-1 text-sm text-slate-500 before:content-['•'] before:mr-1">
                  <span className="font-semibold">${priceHour.toLocaleString('es-CO')}</span>
                  <span className="font-light">/ 3h</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
