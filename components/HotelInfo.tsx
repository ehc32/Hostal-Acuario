"use client"

import { Coffee, MapPinCheck, Tv, Wifi } from "lucide-react"
import Image from "next/image"

// ... imports
interface InfoProps {
  imageUrl?: string
}

export function InfoHotelAcuario({ imageUrl }: InfoProps) {
  const rawImage = imageUrl || ""
  const isValidImage = rawImage.startsWith('/') || rawImage.startsWith('http')
  const img = isValidImage ? rawImage : null

  return (
    <section
      id="informacion"
      className="w-full bg-background py-24 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* --------------------- COLUMNA TEXTO --------------------- */}
        <div className="space-y-10">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground">
            INFORMACIÓN HOSTAL ACUARIOS
          </p>

          <h2 className="text-4xl md:text-5xl font-serif mt-3 text-gray-900 tracking-tight leading-tight">
            Conoce más sobre
            <br />nuestro hostal
          </h2>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
            El Hostal Acuarios ofrece alojamiento por horas y cuenta con un total de 11 habitaciones,
            entre ellas opciones con aire acondicionado y otras con ventilador. El hostal ofrece
            servicios esenciales como internet, televisión y un bar donde se pueden adquirir bebidas
            y snacks.
            <br /><br />
            Su ubicación permite un fácil acceso, encontrándose junto al Archivo Municipal
            y en la zona de Mártires.
          </p>

          {/* Caja de ubicación */}
          <div className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm">
            <MapPinCheck className="w-5 h-5 text-teal-600 mt-1" />
            <p className="text-sm md:text-base text-foreground">
              <span className="font-semibold">Ubicación privilegiada:</span>{" "}
              Junto al Archivo Municipal en la zona de Mártires, con fácil acceso.
            </p>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h3 className="font-semibold text-2xl text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-teal-600 rounded-full" />
              Servicios del alojamiento
            </h3>

            <div className="grid grid-cols-3 gap-4">

              <div className="group p-4 bg-card rounded-xl border border-border shadow-sm 
                              hover:shadow-md hover:border-teal-500/60 transition-all">
                <Wifi className="w-7 h-7 text-teal-600 mb-2" />
                <p className="text-sm font-medium text-foreground">Internet</p>
              </div>

              <div className="group p-4 bg-card rounded-xl border border-border shadow-sm 
                              hover:shadow-md hover:border-teal-500/60 transition-all">
                <Tv className="w-7 h-7 text-teal-600 mb-2" />
                <p className="text-sm font-medium text-foreground">Televisión</p>
              </div>

              <div className="group p-4 bg-card rounded-xl border border-border shadow-sm 
                              hover:shadow-md hover:border-teal-500/60 transition-all">
                <Coffee className="w-7 h-7 text-teal-600 mb-2" />
                <p className="text-sm font-medium text-foreground">Bar</p>
              </div>

            </div>
          </div>
        </div>

        {/* -------------------- COLUMNA IMAGEN -------------------- */}
        <div className="flex justify-center md:justify-end h-full">
          <div
            className="
              relative
              w-full max-w-md md:max-w-none
              h-full
              min-h-[500px]
              rounded-2xl
              overflow-hidden
              bg-card
              border border-border
              shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            "
          >
            {img ? (
              <Image
                src={img}
                alt="Hostal Acuarios"
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <span className="text-sm">Sin imagen configurada</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
