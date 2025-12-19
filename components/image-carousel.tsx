"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// ... imports

interface ImageCarouselProps {
  images?: string[]
}

export function ImageCarousel({ images: propImages }: ImageCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const imagesToUse = propImages && propImages.length > 0
    ? propImages.map((src, i) => ({ src, alt: `Hotel Acuario - Imagen ${i + 1}` }))
    : []

  useEffect(() => {
    // Si no hay imágenes, no iniciamos animación
    if (imagesToUse.length === 0) return

    const track = trackRef.current
    if (!track) return

    let animationId: number
    let position = 0
    const speed = 0.5

    const animate = () => {
      if (!isPaused) {
        position -= speed
        const trackWidth = track.scrollWidth / 3

        if (Math.abs(position) >= trackWidth) {
          position = 0
        }

        track.style.transform = `translateX(${position}px)`
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isPaused, imagesToUse])

  const tripleImages = [...imagesToUse, ...imagesToUse, ...imagesToUse]

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.3em] text-gray-500 uppercase font-light">
            NUESTRA GALERÍA
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-3 text-gray-900 tracking-tight">
            Conoce Nuestras Instalaciones
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Descubre cada rincón de Hotel Acuario a través de nuestra galería
          </p>
        </div>

        {/* CARRUSEL INFINITO */}
        {/* CARRUSEL INFINITO */}
        {imagesToUse.length > 0 ? (
          <div
            className="relative overflow-hidden py-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Gradientes laterales */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            {/* Track de imágenes */}
            <ul
              ref={trackRef}
              className="flex gap-6 will-change-transform"
              style={{ width: 'fit-content' }}
            >
              {tripleImages.map((image, index) => (
                <li
                  key={`${image.src}-${index}`}
                  className="flex-shrink-0 group"
                >
                  <a
                    href={image.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative overflow-hidden rounded-2xl shadow-lg
                           w-[420px] h-[280px] transition-all duration-500
                           hover:shadow-2xl hover:scale-105"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700
                             group-hover:scale-110"
                    />
                    {/* Overlay sutil al hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 w-full bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl my-8">
            <p className="text-slate-400 font-medium">Sin imágenes configuradas en la galería</p>
          </div>
        )}

        {/* Indicador de pausa */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Pasa el cursor sobre las imágenes para pausar el carrusel
        </p>
      </div>
    </section>
  )
}