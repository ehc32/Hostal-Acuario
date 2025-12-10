import { prisma } from "@/lib/prisma"
import { RoomCard } from "@/components/room-card"
import { HabitacionesFilters } from "@/app/habitaciones/filters"
import { Navbar } from "@/components/navbar"
import { Metadata } from "next"
import Link from "next/link"
import { SearchX } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Habitaciones | Hotel Acuario",
  description: "Descubre nuestra colección exclusiva de habitaciones diseñadas para el confort.",
}

export const dynamic = "force-dynamic"

export default async function HabitacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q || ""

  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { holder: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-500">
      <Navbar />

      <div className="pt-24 px-4 container mx-auto">
        {/* Breadcrumb Simple */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Habitaciones</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Section */}
      <div className="pb-10 px-4">
        <div className="container mx-auto text-center max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 delay-100">
            Encuentra tu refugio ideal
          </h1>
          <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 delay-200">
            Explora espacios diseñados para inspirar tranquilidad y confort en cada detalle.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        {/* Filtros Limpios (Sin Card Externa) */}
        <div className="sticky top-20 z-30 p-2 mb-10 transition-all">
          <HabitacionesFilters />
        </div>

        {/* Resultados */}
        <div className="animate-in fade-in slide-in-from-bottom-8 delay-300">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              {query ? `Busqueda: "${query}"` : "Todas las habitaciones"}
            </h2>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
              {rooms.length} {rooms.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-muted/30 border-2 border-dashed border-muted rounded-3xl animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <SearchX className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-foreground mb-2">No encontramos coincidencias</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar tus términos de búsqueda o elimina los filtros para ver más opciones disponibles.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.slug}
                  dbId={room.id}
                  title={room.title}
                  description={room.description}
                  price={room.price}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  priceHour={(room as any).priceHour}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  climate={(room as any).climate}
                  rating={room.rating}
                  reviews={room.reviews}
                  images={room.images}
                  amenities={room.amenities}
                  holder={room.holder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
