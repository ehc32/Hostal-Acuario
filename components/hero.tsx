import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// ... imports
interface HeroProps {
  imageUrl?: string
}

export function Hero({ imageUrl }: HeroProps) {
  const rawImage = imageUrl || ""
  const isValidImage = rawImage.startsWith('/') || rawImage.startsWith('http')
  const bgImage = isValidImage ? rawImage : null

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        {bgImage ? (
          <>
            <Image src={bgImage} alt="Vista panorámica Hotel Acuario" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="w-full h-full bg-slate-50" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl ${bgImage ? 'text-white' : 'text-slate-900'}`}>
          Vive momentos inolvidables en Hotel Acuario
        </h1>

        <p className={`text-base md:text-lg mb-8 max-w-xl ${bgImage ? 'text-white/80' : 'text-slate-600'}`}>
          Descubre un refugio de tranquilidad donde el lujo se encuentra con la naturaleza.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className={`${bgImage ? 'bg-white text-black hover:bg-white/90' : 'bg-slate-900 text-white hover:bg-slate-800'}`} asChild>
            <Link href="/habitaciones">Reservar ahora</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className={`${bgImage ? 'border-white text-white hover:bg-white/10 bg-transparent' : 'border-slate-300 text-slate-900 hover:bg-slate-50'}`}
            asChild
          >
            <Link href="/habitaciones">Ver habitaciones</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
