"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ChevronRight, Loader2, Hotel } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Reservation {
    id: number
    status: string
    startDate: string
    endDate: string
    total: number
    room: {
        id: number
        title: string
        images: string[]
        slug: string
        holder: string
    }
}

export function MyReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const res = await fetch('/api/reservations/my-reservations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!res.ok) throw new Error('Error cargando reservas')

                const data = await res.json()
                setReservations(data)
            } catch (error) {
                console.error(error)
                toast.error("No pudimos cargar tus reservaciones")
            } finally {
                setIsLoading(false)
            }
        }

        fetchReservations()
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pendiente</Badge>
            case "CONFIRMED":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Confirmada</Badge>
            case "COMPLETED":
                return <Badge variant="secondary" className="bg-slate-100 text-slate-700">Completada</Badge>
            case "CANCELLED":
                return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Cancelada</Badge>
            default:
                return <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Mis Reservaciones</h2>
                {reservations.length > 0 && <span className="text-sm text-muted-foreground">{reservations.length} reservación(es)</span>}
            </div>

            <div className="grid gap-4">
                {reservations.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No tienes reservaciones</h3>
                            <p className="text-slate-500 mt-1 mb-6 max-w-sm">
                                Aún no has realizado ninguna reservación. ¡Explora nuestros alojamientos y planea tu próximo viaje!
                            </p>
                            <Button asChild>
                                <Link href="/">Explorar alojamientos</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    reservations.map((reservation) => (
                        <Card key={reservation.id} className="overflow-hidden card-hover-effect transition-all hover:shadow-md border-border/50">
                            <div className="flex flex-col sm:flex-row">
                                {/* Imagen */}
                                <div className="relative w-full sm:w-48 h-48 sm:h-auto aspect-video sm:aspect-square bg-muted">
                                    <Image
                                        src={reservation.room.images[0] || '/placeholder.svg'}
                                        alt={reservation.room.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Detalles */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{reservation.room.title}</h3>
                                                <div className="flex items-center text-sm text-slate-500 mt-1">
                                                    <Hotel className="w-3.5 h-3.5 mr-1" />
                                                    {reservation.room.holder || 'Anfitrión General'}
                                                </div>
                                            </div>
                                            <div className="flex justify-between sm:block w-full sm:w-auto mt-2 sm:mt-0">
                                                {getStatusBadge(reservation.status)}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="flex items-start gap-2.5">
                                                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Llegada</span>
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {format(new Date(reservation.startDate), "d 'de' MMM, yyyy", { locale: es })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-4 flex justify-center mt-0.5 text-slate-400">→</div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salida</span>
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {format(new Date(reservation.endDate), "d 'de' MMM, yyyy", { locale: es })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500">Total pagado</span>
                                            <span className="font-bold text-lg text-slate-900">
                                                ${reservation.total.toLocaleString('es-CO')}
                                            </span>
                                        </div>

                                        <Button variant="outline" size="sm" className="gap-2" asChild>
                                            <Link href={`/habitaciones/${reservation.room.id}`}>
                                                Ver habitación
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
