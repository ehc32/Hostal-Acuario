"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ReservationModal } from "@/components/reservation-modal"
import { cn } from "@/lib/utils"

interface BookingWidgetProps {
    roomId: number
    roomTitle: string
    pricePerNight: number
    maxGuests?: number
}

export function BookingWidget({ roomId, roomTitle, pricePerNight, maxGuests = 4 }: BookingWidgetProps) {
    const [checkIn, setCheckIn] = React.useState<string>("")
    const [checkOut, setCheckOut] = React.useState<string>("")
    const [guests, setGuests] = React.useState(1)

    // Simplificado: usar inputs nativos de tipo date
    // en lugar de calendarios complejos si hubo problemas previos.

    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const handleBookClick = () => {
        if (!checkIn || !checkOut) {
            // Se podría validar aquí
            return
        }
        setIsModalOpen(true)
    }

    // Calcular precio total para pasar al modal
    const days = checkIn && checkOut
        ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
        : 1

    const totalPrice = pricePerNight * days

    // Construir objeto MockRoom para satisfacer props del modal
    // No tenemos la imagen aquí, pero el modal maneja eso opcionalmente
    const mockRoom = {
        id: roomId,
        title: roomTitle,
        price: pricePerNight,
        holder: "Hotel Acuario", // Fallback
        images: [] // Fallback
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="checkin">Llegada</Label>
                    <div className="relative">
                        <Input
                            type="date"
                            id="checkin"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="checkout">Salida</Label>
                    <div className="relative">
                        <Input
                            type="date"
                            id="checkout"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Huéspedes</Label>
                <div className="flex items-center border rounded-md">
                    <button
                        className="px-4 py-2 hover:bg-slate-100 disabled:opacity-50"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                    >
                        -
                    </button>
                    <div className="flex-1 text-center font-medium">{guests}</div>
                    <button
                        className="px-4 py-2 hover:bg-slate-100 disabled:opacity-50"
                        onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                        disabled={guests >= maxGuests}
                    >
                        +
                    </button>
                </div>
            </div>

            <Button
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
                onClick={handleBookClick}
            >
                Reservar
            </Button>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                room={mockRoom}
                checkIn={checkIn ? new Date(checkIn) : null}
                checkOut={checkOut ? new Date(checkOut) : null}
                guests={guests}
                totalPrice={totalPrice}
            />
        </div>
    )
}
