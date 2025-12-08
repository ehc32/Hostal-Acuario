import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Calendar, User, Mail, Phone, CreditCard, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReservationActions } from "@/components/admin/reservation-actions"

// Helper para formato de moneda
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    }).format(amount)
}

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const reservationId = parseInt(id)

    if (isNaN(reservationId)) {
        notFound()
    }

    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: {
            user: true,
            room: true
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any

    if (!reservation) {
        notFound()
    }

    // Calcular noches
    const nights = Math.ceil((reservation.endDate.getTime() - reservation.startDate.getTime()) / (1000 * 60 * 60 * 24))

    return (
        <div className="container max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/reservas">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Reserva #{reservation.id}</h1>
                    <p className="text-sm text-muted-foreground">
                        {reservation.createdAt.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <Badge variant={
                    reservation.status === 'CANCELLED' ? 'destructive' :
                        reservation.status === 'CONFIRMED' ? 'default' :
                            'outline'
                }>
                    {reservation.status === 'PENDING' ? 'Pendiente' :
                        reservation.status === 'CONFIRMED' ? 'Confirmada' :
                            reservation.status === 'CANCELLED' ? 'Cancelada' :
                                reservation.status}
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Client Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Información del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nombre</p>
                                    <p className="font-medium">{reservation.user.name || "Sin nombre"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Estado</p>
                                    <Badge variant="secondary" className="mt-1">
                                        {reservation.user.status || "ACTIVE"}
                                    </Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium">{reservation.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Teléfono</p>
                                        <p className="text-sm font-medium">{reservation.user.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Room Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building className="h-5 w-5" />
                                Habitación
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                {reservation.room.images?.[0] && (
                                    <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                                        <Image
                                            src={reservation.room.images[0]}
                                            alt={reservation.room.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h3 className="font-semibold">{reservation.room.title}</h3>
                                        <p className="text-sm text-muted-foreground">{reservation.room.holder}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {reservation.room.description}
                                    </p>
                                    <Button variant="link" size="sm" asChild className="h-auto p-0">
                                        <Link href={`/habitaciones/${reservation.room.id}`} target="_blank">
                                            Ver habitación completa →
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Ticket Style */}
                <div className="space-y-6">
                    {/* Dates Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5" />
                                Estancia
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Check-in</p>
                                <p className="font-semibold">
                                    {reservation.startDate.toLocaleDateString('es-ES', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Check-out</p>
                                <p className="font-semibold">
                                    {reservation.endDate.toLocaleDateString('es-ES', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Noches</span>
                                <span className="font-semibold">{nights}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CreditCard className="h-5 w-5" />
                                Resumen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {nights} {nights === 1 ? 'noche' : 'noches'}
                                </span>
                                <span>{formatCurrency(reservation.room.price * nights)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Limpieza</span>
                                <span>{formatCurrency(0)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total</span>
                                <span className="text-xl font-bold">{formatCurrency(reservation.total)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardContent className="pt-6">
                            <ReservationActions id={reservation.id} currentStatus={reservation.status} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
