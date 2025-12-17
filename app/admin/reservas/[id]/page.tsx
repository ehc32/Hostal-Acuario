import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Calendar, User, Mail, Phone, CreditCard, Building, Clock, MapPin } from "lucide-react"
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

    // Lógica diferenciada por tipo de estancia
    const isHourly = reservation.type === 'HOURLY'

    // Cálculos
    let durationLabel = ''
    let durationValue = 0

    if (isHourly) {
        // Calcular duración en horas
        const diffMs = reservation.endDate.getTime() - reservation.startDate.getTime()
        durationValue = Math.ceil(diffMs / (1000 * 60 * 60))
        durationLabel = `${durationValue} Horas`
    } else {
        // Calcular duración en noches
        const diffMs = reservation.endDate.getTime() - reservation.startDate.getTime()
        durationValue = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
        durationLabel = `${durationValue} ${durationValue === 1 ? 'noche' : 'noches'}`
    }

    return (
        <div className="w-full p-6 space-y-8">
            {/* Header Simplified */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reservas">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reserva #{reservation.id}</h1>
                            <Badge variant={
                                reservation.status === 'CANCELLED' ? 'destructive' :
                                    reservation.status === 'CONFIRMED' ? 'default' :
                                        'outline'
                            } className={
                                reservation.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                                    reservation.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' : ''
                            }>
                                {reservation.status === 'PENDING' ? 'Pendiente' :
                                    reservation.status === 'CONFIRMED' ? 'Confirmada' :
                                        reservation.status === 'CANCELLED' ? 'Cancelada' :
                                            reservation.status}
                            </Badge>
                            <Badge variant="secondary" className="font-mono">
                                {isHourly ? 'POR HORAS' : 'POR NOCHE'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            Creada el {reservation.createdAt.toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ReservationActions id={reservation.id} currentStatus={reservation.status} />
                </div>
            </div>

            {/* Content Grid - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {/* 1. Detalles de la Estancia (Dates/Time) */}
                <Card className="shadow-sm border-slate-200 h-full flex flex-col">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b">
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-700">
                            <Clock className="h-4 w-4" />
                            Tiempo de Estancia
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {isHourly ? 'Hora Inicio' : 'Check-in'}
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    {reservation.startDate.toLocaleDateString('es-ES', isHourly ? {
                                        hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'
                                    } : {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </p>
                                {!isHourly && (
                                    <p className="text-xs text-muted-foreground">
                                        {reservation.startDate.toLocaleDateString('es-ES', { weekday: 'long' })}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {isHourly ? 'Hora Fin' : 'Check-out'}
                                </p>
                                <p className="text-lg font-semibold text-slate-900">
                                    {reservation.endDate.toLocaleDateString('es-ES', isHourly ? {
                                        hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'
                                    } : {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </p>
                                {!isHourly && (
                                    <p className="text-xs text-muted-foreground">
                                        {reservation.endDate.toLocaleDateString('es-ES', { weekday: 'long' })}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Duración Total</span>
                            <span className="text-lg font-bold text-slate-900">{durationLabel}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Información del Cliente */}
                <Card className="shadow-sm border-slate-200 h-full flex flex-col">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b">
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-700">
                            <User className="h-4 w-4" />
                            Cliente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 flex-1">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                                {reservation.user.name ? reservation.user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-base">{reservation.user.name || "Sin nombre"}</p>
                                <Badge variant="outline" className="text-xs font-normal">
                                    {reservation.user.status || "ACTIVE"}
                                </Badge>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                <span className="text-slate-600 truncate">{reservation.user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                                <span className="text-slate-600">{reservation.user.phone || "No registrado"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Habitación */}
                <Card className="shadow-sm border-slate-200 h-full flex flex-col">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b">
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-700">
                            <Building className="h-4 w-4" />
                            Habitación
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col">
                        <div className="relative h-40 w-full bg-muted">
                            {reservation.room.images?.[0] ? (
                                <Image
                                    src={reservation.room.images[0]}
                                    alt={reservation.room.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    Sin imagen
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <div className="text-white">
                                    <p className="font-bold text-lg leading-none mb-1">{reservation.room.title}</p>
                                    <p className="text-xs text-white/80 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {reservation.room.holder}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            {/* Amenities or Description snippet could go here */}
                            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                                <Link href={`/habitaciones/${reservation.room.slug || reservation.room.id}`} target="_blank">
                                    Ver detalles habitación
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Resumen financiero */}
                <Card className="shadow-sm border-slate-200 h-full flex flex-col">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b">
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-700">
                            <CreditCard className="h-4 w-4" />
                            Pago
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 flex-1">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tarifa base</span>
                                <span className="font-medium">
                                    {formatCurrency(isHourly ? (reservation.room.priceHour || 0) : reservation.room.price)}
                                    <span className="text-xs text-muted-foreground font-normal"> / {isHourly ? 'hora' : 'noche'}</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Cantidad</span>
                                <span className="font-medium">x {durationValue}</span>
                            </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="space-y-1">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-semibold text-slate-700">Total a Pagar</span>
                                <span className="text-2xl font-bold text-amber-600 leading-none">
                                    {formatCurrency(reservation.total)}
                                </span>
                            </div>
                            <p className="text-xs text-right text-muted-foreground">
                                COP (Pesos Colombianos)
                            </p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
