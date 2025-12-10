// Force recompile
import { Navbar } from "@/components/navbar"
import Image from "next/image"
import Link from "next/link"
import { Check, User } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BookingCard } from "../../../components/booking-card"
import { ReviewsSection } from "@/components/reviews-section"
import { FavoriteButton } from "@/components/favorite-button"
import { RoomGallery } from "@/components/room-gallery"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from 'next'

type RoomPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Habitación ${id} | Tu Hotel`
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params
  const roomId = parseInt(id)

  const room = await prisma.room.findFirst({
    where: {
      OR: [
        { id: isNaN(roomId) ? undefined : roomId },
        { slug: id }
      ]
    }
  })

  if (!room) {
    notFound()
  }

  // Fetch reviews (Casted to any due to Prisma generation issue)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews = await (prisma as any).review.findMany({
    where: { roomId: room.id },
    orderBy: { createdAt: 'desc' }
  })

  // Fallbacks
  const images = room.images && room.images.length > 0 ? room.images : ["/placeholder.svg?height=600&width=800"]

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="pt-24 pb-8 max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/habitaciones">Habitaciones</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{room.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Galería */}
        {/* Galería */}
        <div className="mb-8">
          <RoomGallery images={images} title={room.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna Izquierda: Info + Reviews */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-foreground">{room.holder}</span> · {room.rating.toFixed(2)} ★ ({room.reviews} reseñas)
                  </p>
                </div>
                <div className="flex gap-2">
                  <FavoriteButton roomId={room.id} />
                </div>
              </div>

              <hr className="my-6 border-border" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <p className="font-semibold">Anfitrión: {room.holder}</p>
                  <p className="text-sm text-muted-foreground">Súper anfitrión · Respuesta rápida</p>
                </div>
              </div>

              <hr className="my-6 border-border" />

              <div>
                <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-justify break-words text-base">
                  {room.description}
                </p>
              </div>

              <hr className="my-6 border-border" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Servicios</h3>
                <div className="grid grid-cols-2 gap-y-3">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* SECCIÓN DE RESEÑAS */}
            <div id="reviews">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <ReviewsSection roomId={room.id} initialReviews={reviews as any[]} />
            </div>
          </div>

          {/* Columna Derecha: Sticky Booking */}
          <div className="relative">
            <div className="sticky top-24">
              <BookingCard room={room} />
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
