"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, User } from "lucide-react"

const testimonials = [
  {
    quote:
      "Hotel Acuario superó todas mis expectativas. Las habitaciones son amplias, la piscina es perfecta para el clima de Melgar y el personal es muy atento.",
    name: "Carlos Mendoza",
    role: "Viajero Frecuente",
  },
  {
    quote:
      "Excelente ubicación cerca de Piscilago. El desayuno americano es delicioso y las instalaciones están muy bien mantenidas. Volveremos sin duda.",
    name: "María González",
    role: "Familia con niños",
  },
  {
    quote:
      "La atención en recepción las 24 horas es muy conveniente. El restaurante tiene buena comida y el ambiente es tranquilo. Muy recomendado.",
    name: "Andrés Rodríguez",
    role: "Turista Nacional",
  },
  {
    quote:
      "Pasamos un fin de semana increíble. Los niños disfrutaron mucho de la piscina y la sala de juegos. El precio es muy accesible para la calidad que ofrecen.",
    name: "Laura Martínez",
    role: "Madre de Familia",
  },
  {
    quote:
      "El servicio fue excepcional. La limpieza de las habitaciones impecable. Muy satisfecho con la atención recibida.",
    name: "Pedro Salazar",
    role: "Viajero Solo",
  },
  {
    quote:
      "Todo estuvo excelente. Muy buena ubicación y áreas comunes confortables. Recomendadísimo.",
    name: "Fernanda Díaz",
    role: "Turista Nacional",
  },
  {
    quote:
      "Todo estuvo excelente. Muy buena ubicación y áreas comunes confortables. Recomendadísimo.",
    name: "Fernanda Díaz",
    role: "Turista Nacional",
  },
  {
    quote:
      "Todo estuvo excelente. Muy buena ubicación y áreas comunes confortables. Recomendadísimo.",
    name: "Fernanda Díaz",
    role: "Turista Nacional",
  },
  {
    quote:
      "Todo estuvo excelente. Muy buena ubicación y áreas comunes confortables. Recomendadísimo.",
    name: "Fernanda Díaz",
    role: "Turista Nacional",
  },
  {
    quote:
      "Todo estuvo excelente. Muy buena ubicación y áreas comunes confortables. Recomendadísimo.",
    name: "Fernanda Díaz",
    role: "Turista Nacional",
  },
  {
    quote:
      "Todo estuvo excelente. Muy buena ubicación y áreas comunes confortables. Recomendadísimo.",
    name: "Fernanda Díaz",
    role: "Turista Nacional",
  },
  {
    quote:
      "Todo estuvo excelente. Muy buena ubicación y áreas comunes confortables. Recomendadísimo.",
    name: "Fernanda Díaz",
    role: "Turista Nacional",
  },
]

export function Testimonials() {
  const itemsPerSlide = 4
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide)

  const [currentSlide, setCurrentSlide] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  // 🔁 Movimiento automático SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  const next = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // Posición deslizante
  const slidePosition = `translateX(-${currentSlide * 100}%)`

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-neutral-500 uppercase">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-serif mt-2 text-neutral-900">
            Lo que dicen nuestros huéspedes
          </h2>
          <p className="text-neutral-500 mt-3 max-w-xl mx-auto">
            Experiencias reales de viajeros que han disfrutado de su estadía en Hotel Acuario
          </p>
        </div>

        {/* CARRUSEL CONTENEDOR */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: slidePosition }}
          >
            {/* SLIDES (cada slide = 4 tarjetas) */}
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const items = testimonials.slice(
                slideIndex * itemsPerSlide,
                slideIndex * itemsPerSlide + itemsPerSlide
              )

              return (
                <div key={slideIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-full px-2">
                  {items.map((t, index) => (
                    <div
                      key={index}
                      className="bg-neutral-50 rounded-2xl p-6 min-h-[260px] flex flex-col justify-between shadow-sm"
                    >
                      <p className="text-neutral-700 text-sm leading-relaxed">"{t.quote}"</p>

                      <div className="flex items-center gap-3 mt-6">
                        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-neutral-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">{t.name}</p>
                          <p className="text-neutral-500 text-xs">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* ARROWS */}
        <div className="flex justify-center gap-3 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  )
}
