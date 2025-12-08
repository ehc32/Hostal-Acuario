"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface BookingCardProps {
    room: {
        id: number
        title: string
        price: number
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

    const handleReserveClick = () => {
        if (!checkIn || !checkOut) {
            toast.error("Por favor selecciona las fechas de tu estadía")
            return
        }
        if (checkIn >= checkOut) {
            toast.error("La fecha de salida debe ser posterior a la de llegada")
            return
        }

        // Redirigir a pantalla completa de checkout
        const params = new URLSearchParams({
            checkIn,
            checkOut,
            guests: guests.toString()
        })

        router.push(`/checkout/${room.id}?${params.toString()}`)
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-semibold text-foreground">${room.price.toLocaleString()} COP</span>
                <span className="text-muted-foreground ml-1">noche</span>
            </div>

            <div className="rounded-lg border border-border overflow-hidden mb-4">
                <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-3 hover:bg-muted/50 transition-colors">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Llegada</label>
                        <input
                            type="date"
                            min={today}
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full mt-1 bg-transparent text-sm outline-none text-foreground cursor-pointer"
                        />
                    </div>
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

            <p className="text-center text-sm text-muted-foreground mt-4">No se hará ningún cargo todavía</p>
        </div>
    )
}
