"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">

      {/* Background Image Container */}
      <div className="absolute inset-0 select-none">
        <Image
          src="/bander.png"
          alt="Vista panorámica Hotel Acuario"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Modern Gradient Overlay: Oscuro abajo para leer texto, claro arriba para dar aire */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">



        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 max-w-4xl drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
          Vive momentos inolvidables en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Hotel Acuario</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-zinc-200 mb-8 max-w-2xl leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-forwards">
          Descubre un refugio de tranquilidad donde el lujo se encuentra con la naturaleza.
          Tu escapada perfecta comienza aquí.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-forwards">
          <Button
            size="lg"
            className="h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-100 hover:scale-105 transition-all duration-300 font-semibold text-base shadow-xl"
            asChild
          >
            <Link href="/habitaciones">
              Reservar ahora <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-full border-white/30 bg-white/5 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm transition-all duration-300 font-medium text-base"
            asChild
          >
            <Link href="/habitaciones">
              Ver habitaciones
            </Link>
          </Button>
        </div>

      </div>
    </section>
  )
}
