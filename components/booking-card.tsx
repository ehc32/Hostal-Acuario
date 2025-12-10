"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BookingCardProps {
    room: {
        id: number
        title: string
        price: number
        priceHour?: number
        images: string[]
        holder: string
    }
}

export function BookingCard({ room }: BookingCardProps) {
    const router = useRouter()

    // Default dates: today and tomorrow
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]

    const [checkIn, setCheckIn] = React.useState(today)
    const [checkOut, setCheckOut] = React.useState(tomorrow)
    const [guests, setGuests] = React.useState(1)

    // Si la habitación tiene precio por hora, permitimos elegir
    const hasHourlyOption = (room.priceHour || 0) > 0
    const [bookingType, setBookingType] = React.useState<"NIGHTLY" | "HOURLY">("NIGHTLY")

    const handleReserveClick = () => {
        if (!checkIn || (!checkOut && bookingType === "NIGHTLY")) {
            toast.error("Por favor selecciona las fechas de tu estadía")
            return
        }

        if (bookingType === "NIGHTLY" && checkIn >= checkOut) {
            toast.error("La fecha de salida debe ser posterior a la de llegada")
            return
        }

        // Redirigir a pantalla completa de checkout
        const params = new URLSearchParams({
            checkIn,
            checkOut: bookingType === "NIGHTLY" ? checkOut : checkIn, // Si es por hora, sale el mismo día
            guests: guests.toString(),
            type: bookingType
        })

        router.push(`/checkout/${room.id}?${params.toString()}`)
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg space-y-6">

            {/* Selector de Tipo de Estancia (Si aplica) */}
            {hasHourlyOption && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Tipo de estancia:</label>
                    <Select
                        value={bookingType}
                        onValueChange={(val) => setBookingType(val as "NIGHTLY" | "HOURLY")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NIGHTLY">Hospedaje (Noche)</SelectItem>
                            <SelectItem value="HOURLY">Por Rato (3 Horas)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                    ${(bookingType === "NIGHTLY" ? room.price : room.priceHour)?.toLocaleString()} COP
                </span>
                <span className="text-muted-foreground ml-1">
                    {bookingType === "NIGHTLY" ? "noche" : " / 3 horas"}
                </span>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {bookingType === "NIGHTLY" ? "Llegada" : "Fecha"}
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full mt-1 bg-transparent text-sm outline-none text-foreground cursor-pointer"
                        />
                    </div>
                    {bookingType === "NIGHTLY" && (
                        <div className="p-3 hover:bg-muted/50 transition-colors">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Salida</label>
                            <input
                                type="date"
                                min={checkIn || today}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full mt-1 bg-transparent text-sm outline-none text-foreground cursor-pointer"
                            />
                        </div>
                    )}
                </div>
                <div className="border-t border-border p-3 hover:bg-muted/50 transition-colors">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Huéspedes</label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full mt-1 bg-transparent text-sm outline-none text-foreground cursor-pointer"
                    >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n} huésped{n > 1 ? 'es' : ''}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Button
                onClick={handleReserveClick}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                Reservar
            </Button>

            <p className="text-center text-sm text-muted-foreground">No se hará ningún cargo todavía</p>
        </div>
    )
}
