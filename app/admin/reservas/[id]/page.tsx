import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Calendar, User, Mail, Phone, CreditCard, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CancelReservationButton } from "./cancel-button"

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
        <div className="flex flex-col space-y-6 p-8 w-full max-w-[1920px] mx-auto">
            {/* Header de Navegación Mejorado */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reservas">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            Reserva #{reservation.id}
                            <Badge variant={reservation.status === 'CANCELLED' ? 'destructive' : 'default'} className="text-base px-3 py-1">
                                {reservation.status}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Creada el {reservation.createdAt.toLocaleDateString()} a las {reservation.createdAt.toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-[200px]">
                        <CancelReservationButton id={reservation.id} currentStatus={reservation.status} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Columna Izquierda (Info Principal): Cliente + Habitación */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Tarjeta Cliente Expandida */}
                    <Card className="shadow-sm border-l-4 border-l-primary">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Información del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Nombre Completo</p>
                                    <p className="font-bold text-xl mt-1">{reservation.user.name || "Sin nombre"}</p>
                                    <Badge variant="secondary" className="mt-2">{reservation.user.status || "ACTIVE"}</Badge>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Correo Electrónico</p>
                                            <p className="font-medium text-base truncate">{reservation.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Teléfono</p>
                                            <p className="font-medium text-base">{reservation.user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center border-l pl-8">
                                    <div className="text-center w-full">
                                        <p className="text-sm text-muted-foreground">ID Cliente</p>
                                        <p className="text-lg font-mono">{reservation.userId}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tarjeta Habitación (Horizontal) */}
                    <Card className="overflow-hidden shadow-sm">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 aspect-video md:aspect-auto relative bg-muted">
                                {reservation.room.images?.[0] ? (
                                    <div className="w-full h-full relative">
                                        <Image
                                            src={reservation.room.images[0]}
                                            alt={reservation.room.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        Sin Imagen
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <CardTitle className="text-xl mb-2">{reservation.room.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <Building className="h-3 w-3" /> Host: {reservation.room.holder}
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/habitaciones/${reservation.room.id}`} target="_blank">
                                            Ver publicación <ChevronLeft className="h-4 w-4 rotate-180 ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                                    {reservation.room.description}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Precio Base</p>
                                        <p className="font-medium">{formatCurrency(reservation.room.price)} / noche</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">ID Habitación</p>
                                        <p className="font-medium">#{reservation.roomId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Columna Derecha (Pagos y Estancia) */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-slate-50 border-slate-200 shadow-md h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Resumen de Estancia
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-center bg-white p-4 rounded-xl border shadow-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Entrada</p>
                                    <p className="text-lg font-bold text-slate-800">{reservation.startDate.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Salida</p>
                                    <p className="text-lg font-bold text-slate-800">{reservation.endDate.toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{nights} noches x {formatCurrency(reservation.room.price)}</span>
                                    <span>{formatCurrency(reservation.room.price * nights)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Tarifa de limpieza</span>
                                    <span>$0 COP</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-primary">{formatCurrency(reservation.total)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg text-blue-700">
                                <CreditCard className="h-4 w-4" />
                                Espera de Confirmación
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
