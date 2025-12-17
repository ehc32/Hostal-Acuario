"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { differenceInDays, parseISO, addDays, format } from "date-fns"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

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

    // Default dates
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]

    const [checkIn, setCheckIn] = React.useState(today)
    const [checkOut, setCheckOut] = React.useState(tomorrow)
    const [guests, setGuests] = React.useState(1)

    const hasHourlyOption = (room.priceHour || 0) > 0
    const [bookingType, setBookingType] = React.useState<"NIGHTLY" | "HOURLY">("NIGHTLY")

    // Logic: Reset checkOut if checkIn changes to be after or equal to checkOut
    React.useEffect(() => {
        if (bookingType === "NIGHTLY" && checkIn >= checkOut) {
            const nextDay = addDays(parseISO(checkIn), 1)
            setCheckOut(format(nextDay, 'yyyy-MM-dd'))
        }
    }, [checkIn, bookingType]) // eslint-disable-line react-hooks/exhaustive-deps

    // Derived state
    const nights = React.useMemo(() => {
        if (!checkIn || !checkOut) return 0
        const start = parseISO(checkIn)
        const end = parseISO(checkOut)
        const diff = differenceInDays(end, start)
        return diff > 0 ? diff : 0
    }, [checkIn, checkOut])

    const totalPrice = React.useMemo(() => {
        if (bookingType === "HOURLY") return room.priceHour || 0
        return (room.price * nights)
    }, [bookingType, room.price, room.priceHour, nights])

    const handleReserveClick = () => {
        if (!checkIn || (!checkOut && bookingType === "NIGHTLY")) {
            toast.error("Por favor selecciona las fechas")
            return
        }

        if (bookingType === "NIGHTLY" && nights <= 0) {
            toast.error("Fecha de salida inválida")
            return
        }

        const params = new URLSearchParams({
            checkIn,
            checkOut: bookingType === "NIGHTLY" ? checkOut : checkIn,
            guests: guests.toString(),
            type: bookingType
        })

        router.push(`/checkout/${room.id}?${params.toString()}`)
    }

    return (
        <div className="p-6 space-y-6 select-none bg-white">

            {/* Header / Price */}
            <div className="space-y-4">
                <div className="flex flex-col">
                    <span className="text-sm text-slate-500 font-medium">Precio por {bookingType === "NIGHTLY" ? "noche" : "rato"}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
                            ${(bookingType === "NIGHTLY" ? room.price : room.priceHour)?.toLocaleString('es-CO')}
                        </span>
                        <span className="text-slate-400 font-medium text-sm">COP</span>
                    </div>
                </div>

                {hasHourlyOption && (
                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button
                            onClick={() => setBookingType("NIGHTLY")}
                            className={cn(
                                "flex-1 text-sm font-semibold py-2 rounded-md transition-all",
                                bookingType === "NIGHTLY"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                            )}
                        >
                            Hospedaje
                        </button>
                        <button
                            onClick={() => setBookingType("HOURLY")}
                            className={cn(
                                "flex-1 text-sm font-semibold py-2 rounded-md transition-all",
                                bookingType === "HOURLY"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                            )}
                        >
                            Por Rato
                        </button>
                    </div>
                )}
            </div>

            {/* Date/Guest Picker */}
            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200">

                {/* Dates */}
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                    <div className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group relative">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors mb-0.5 block">
                            Llegada
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer p-0 z-10 relative"
                        />
                    </div>
                    {bookingType === "NIGHTLY" ? (
                        <div className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group relative">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors mb-0.5 block">
                                Salida
                            </label>
                            <input
                                type="date"
                                min={checkIn}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer p-0 z-10 relative"
                            />
                        </div>
                    ) : (
                        <div className="p-3.5 bg-slate-50 flex flex-col justify-center items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duración</span>
                            <span className="text-sm font-semibold text-slate-600">3 Horas</span>
                        </div>
                    )}
                </div>

                {/* Guests */}
                <div className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors mb-0.5">
                            Huéspedes
                        </label>
                        <span className="text-sm font-semibold text-slate-900">
                            {guests} persona{guests > 1 ? 's' : ''}
                        </span>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            disabled={guests <= 1}
                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:hover:border-slate-200 transition-all bg-white"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-800 hover:text-slate-900 transition-all bg-white"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <Button
                onClick={handleReserveClick}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
                Reservar ahora
            </Button>

            {/* Price Breakdown */}
            {bookingType === "NIGHTLY" && nights > 0 && (
                <div className="pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between text-slate-600 text-sm">
                        <span className="underline decoration-slate-300 decoration-1 underline-offset-4">
                            ${room.price.toLocaleString('es-CO')} x {nights} noches
                        </span>
                        <span>${totalPrice.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="border-t border-slate-100" />
                    <div className="flex justify-between items-baseline text-slate-900">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-xl text-amber-700">${(totalPrice).toLocaleString('es-CO')}</span>
                    </div>
                </div>
            )}

            {bookingType === "HOURLY" && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-baseline text-slate-900">
                        <span className="font-semibold">Total a pagar</span>
                        <span className="font-bold text-xl text-amber-700">${totalPrice.toLocaleString('es-CO')}</span>
                    </div>
                </div>
            )}

        </div>
    )
}
