"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  { src: "/carusel/IMG-20251202-WA0009.jpg", alt: "Hotel Acuario - Imagen 1" },
  { src: "/carusel/IMG-20251202-WA0010.jpg", alt: "Hotel Acuario - Imagen 2" },
  { src: "/carusel/IMG-20251202-WA0011.jpg", alt: "Hotel Acuario - Imagen 3" },
  { src: "/carusel/IMG-20251202-WA0012.jpg", alt: "Hotel Acuario - Imagen 4" },
  { src: "/carusel/IMG-20251202-WA0013.jpg", alt: "Hotel Acuario - Imagen 5" },
  { src: "/carusel/IMG-20251202-WA0014.jpg", alt: "Hotel Acuario - Imagen 6" },
  { src: "/carusel/IMG-20251202-WA0015.jpg", alt: "Hotel Acuario - Imagen 7" },
  { src: "/carusel/IMG-20251202-WA0016.jpg", alt: "Hotel Acuario - Imagen 8" },
  { src: "/carusel/IMG-20251202-WA0017.jpg", alt: "Hotel Acuario - Imagen 9" },
  { src: "/carusel/IMG-20251202-WA0018.jpg", alt: "Hotel Acuario - Imagen 10" },
  { src: "/carusel/IMG-20251202-WA0019.jpg", alt: "Hotel Acuario - Imagen 11" },
  { src: "/carusel/IMG-20251202-WA0020.jpg", alt: "Hotel Acuario - Imagen 12" },
  { src: "/carusel/IMG-20251202-WA0021.jpg", alt: "Hotel Acuario - Imagen 13" },
  { src: "/carusel/IMG-20251202-WA0022.jpg", alt: "Hotel Acuario - Imagen 14" },
  { src: "/carusel/IMG-20251202-WA0023.jpg", alt: "Hotel Acuario - Imagen 15" },
  { src: "/carusel/IMG-20251202-WA0024.jpg", alt: "Hotel Acuario - Imagen 16" },
  { src: "/carusel/IMG-20251202-WA0025.jpg", alt: "Hotel Acuario - Imagen 17" },
  { src: "/carusel/IMG-20251202-WA0026.jpg", alt: "Hotel Acuario - Imagen 18" },
  { src: "/carusel/IMG-20251202-WA0027.jpg", alt: "Hotel Acuario - Imagen 19" },
  { src: "/carusel/IMG-20251202-WA0028.jpg", alt: "Hotel Acuario - Imagen 20" },
  { src: "/carusel/IMG-20251202-WA0029.jpg", alt: "Hotel Acuario - Imagen 21" },
]

export function ImageCarousel() {
  const trackRef = useRef<HTMLUListElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
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
  }, [isPaused])

  const tripleImages = [...images, ...images, ...images]

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

        {/* Indicador de pausa */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Pasa el cursor sobre las imágenes para pausar el carrusel
        </p>
      </div>
    </section>
  )
}