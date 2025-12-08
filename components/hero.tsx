import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src="/bander.png" alt="Vista panorámica Hotel Acuario" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl">
          Vive momentos inolvidables en Hotel Acuario
        </h1>

        <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl">
          Descubre un refugio de tranquilidad donde el lujo se encuentra con la naturaleza.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="bg-white text-black hover:bg-white/90" asChild>
            <Link href="/habitaciones">Reservar ahora</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 bg-transparent"
            asChild
          >
            <Link href="/habitaciones">Ver habitaciones</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
