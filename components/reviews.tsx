"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Review {
  id: number
  author: string
  avatar: string
  date: string
  rating: number
  comment: string
  location?: string
}

const reviewsData: Review[] = [
  {
    id: 1,
    author: "María González",
    avatar: "MG",
    date: "Noviembre 2024",
    rating: 5,
    comment:
      "Excelente hotel, muy limpio y el personal muy amable. La ubicación es perfecta para conocer la ciudad. Definitivamente volveré.",
    location: "Bogotá, Colombia",
  },
  {
    id: 2,
    author: "Carlos Rodríguez",
    avatar: "CR",
    date: "Octubre 2024",
    rating: 5,
    comment:
      "Muy buena relación calidad-precio. Las habitaciones son cómodas y el aire acondicionado funciona perfectamente. Recomendado.",
    location: "Medellín, Colombia",
  },
  {
    id: 3,
    author: "Ana Martínez",
    avatar: "AM",
    date: "Octubre 2024",
    rating: 4,
    comment: "Buena estadía en general. El desayuno podría mejorar pero las instalaciones están muy bien mantenidas.",
    location: "Cali, Colombia",
  },
  {
    id: 4,
    author: "Pedro Sánchez",
    avatar: "PS",
    date: "Septiembre 2024",
    rating: 5,
    comment: "El mejor hotel de la zona. Tranquilo, limpio y con excelente servicio. El parqueadero es muy seguro.",
    location: "Barranquilla, Colombia",
  },
  {
    id: 5,
    author: "Laura Jiménez",
    avatar: "LJ",
    date: "Septiembre 2024",
    rating: 5,
    comment:
      "Increíble atención del personal. Me ayudaron con todo lo que necesité. Las habitaciones son amplias y cómodas.",
    location: "Cartagena, Colombia",
  },
  {
    id: 6,
    author: "Diego Hernández",
    avatar: "DH",
    date: "Agosto 2024",
    rating: 4,
    comment:
      "Muy buen hotel para viajes de negocios. WiFi estable y habitaciones silenciosas. Volveré en mi próximo viaje.",
    location: "Bucaramanga, Colombia",
  },
]

const ratingCategories = [
  { name: "Limpieza", rating: 4.9 },
  { name: "Comunicación", rating: 5.0 },
  { name: "Ubicación", rating: 4.8 },
  { name: "Llegada", rating: 4.9 },
  { name: "Calidad", rating: 4.7 },
]

export function ReviewsSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const reviewsPerPage = 4
  const totalPages = Math.ceil(reviewsData.length / reviewsPerPage)

  const displayedReviews = reviewsData.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage)

  const averageRating = (reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length).toFixed(2)

  return (
    <section className="py-8">
      {/* Header con rating general */}
      <div className="flex items-center gap-3 mb-8">
        <Star className="h-6 w-6 fill-current text-foreground" />
        <h2 className="text-xl font-semibold">{averageRating}</h2>
        <span className="text-muted-foreground">·</span>
        <span className="text-xl font-semibold">{reviewsData.length} reseñas</span>
      </div>

      {/* Categorías de rating */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {ratingCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{category.name}</span>
              <span className="font-medium">{category.rating}</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: `${(category.rating / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <hr className="mb-8 border-border" />

      {/* Grid de reseñas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {displayedReviews.map((review) => (
          <div key={review.id} className="group">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-medium">
                {review.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-foreground">{review.author}</h4>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? "fill-current text-foreground" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>

                {review.location && <p className="text-sm text-muted-foreground mb-2">{review.location}</p>}

                <p className="text-sm text-muted-foreground mb-2">{review.date}</p>

                <p className="text-foreground leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navegación y botón ver más */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="rounded-lg border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
        >
          Mostrar las {reviewsData.length} reseñas
        </Button>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
