// Force recompile
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Check, CopyIcon, MapPin, Share, Star, User } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BookingCard } from "@/components/booking-card"
import { ReviewsSection } from "@/components/reviews-section"
import { FavoriteButton } from "@/components/favorite-button"
import { RoomGallery } from "@/components/room-gallery"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from 'next'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews = await (prisma as any).review.findMany({
    where: { roomId: room.id },
    orderBy: { createdAt: 'desc' }
  })

  // Fallbacks
  const images = room.images && room.images.length > 0 ? room.images : ["/placeholder.svg?height=600&width=800"]

  return (
    <main className="min-h-screen bg-white pb-20">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER SECTION: Breadcrumbs + Title + Actions */}
        <div className="mb-6 space-y-4">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="hover:text-amber-600 transition-colors">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/habitaciones" className="hover:text-amber-600 transition-colors">Habitaciones</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-slate-900">{room.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{room.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <Star className="w-4 h-4 fill-slate-900" /> {room.rating.toFixed(2)}
                </span>
                <span>·</span>
                <span className="underline decoration-slate-300 font-medium cursor-pointer hover:text-slate-900 transition-colors">
                  {room.reviews} reseñas
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> Neia-Huila, Colombia
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-full border-slate-200 hover:bg-slate-50">
                <CopyIcon className="w-4 h-4" />
                Copiar Link
              </Button>
              <div className="hover:scale-105 transition-transform">
                <FavoriteButton roomId={room.id} />
              </div>
            </div>
          </div>
        </div>

        {/* GALLERIA */}
        <div className="rounded-2xl overflow-hidden shadow-sm mb-10">
          <RoomGallery images={images} title={room.title} />
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 relative">

          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-10">

            {/* HOST INFO */}
            <div className="flex items-center justify-between py-6 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-slate-900">Anfitrión: {room.holder || "Hotel Acuario"}</h2>
              </div>
              <Avatar className="h-14 w-14 border border-slate-100">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold text-lg">
                  {room.holder ? room.holder[0].toUpperCase() : 'H'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* DESCRIPTION */}
            <div className="py-2 space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Acerca de este espacio</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg font-light">
                {room.description}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* AMENITIES */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Lo que ofrece este lugar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Check className="w-5 h-5 text-slate-800" />
                    <span className="text-base">{amenity}</span>
                  </div>
                ))}
                {/* Fake Amenities for demo if empty */}
                {(!room.amenities || room.amenities.length === 0) && (
                  <>
                    <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5" />Wifi de alta velocidad</div>
                    <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5" />Zona de trabajo</div>
                    <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5" />Aire Acondicionado</div>
                  </>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* REVIEWS */}
            <div id="reviews" className="pt-4">
              <ReviewsSection roomId={room.id} initialReviews={reviews as any[]} />
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Card */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 w-full">
              <div className="shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 overflow-hidden bg-white">
                <BookingCard room={room} />
              </div>

            </div>
          </div>

          {/* MOBILE BOOKING BAR (Fixed Bottom) - Opcional, si no ya lo maneja el BookingCard responsive */}
        </div>

      </div>
    </main>
  )
}
