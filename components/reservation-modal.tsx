"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext" // Asumo que existe
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ReservationModalProps {
    isOpen: boolean
    onClose: () => void
    room: any // Tipar mejor si es posible (Room)
    checkIn: Date | null
    checkOut: Date | null
    guests: number
    totalPrice: number
}

export function ReservationModal({
    isOpen,
    onClose,
    room,
    checkIn,
    checkOut,
    guests,
    totalPrice
}: ReservationModalProps) {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    // Form State para invitados
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    })

    // Calcular días (simple helper)
    const days = checkIn && checkOut
        ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
        : 0

    const handleCreateReservation = async () => {
        setIsLoading(true)

        try {
            const payload = {
                roomId: room.id, // Debe ser el ID numérico
                startDate: checkIn,
                endDate: checkOut,
                total: totalPrice,
                guests,
                // Datos de usuario
                userId: user?.id, // Si existe
                ...(!user ? formData : {}) // Si no existe, enviamos el form
            }

            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Error al reservar")

            toast.success("¡Reserva creada con éxito!")
            onClose()
            // Aquí podrías redirigir a una página de "Mis Reservas" o "Éxito"
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                <div className="grid md:grid-cols-2 h-full">

                    {/* Columna Izquierda: Datos de la Reserva (Estilo Ticket) */}
                    <div className="bg-muted/30 p-6 md:border-r border-border flex flex-col gap-4">
                        <DialogHeader className="p-0">
                            <DialogTitle className="text-xl">Tu viaje</DialogTitle>
                        </DialogHeader>

                        {/* Resumen Habitación */}
                        <div className="flex gap-4 items-start mt-2">
                            {/* Miniatura Imagen (Placeholder si no hay) */}
                            <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden relative shrink-0">
                                {room.images?.[0] && (
                                    <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm line-clamp-2">{room.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">Host: {room.holder}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Detalles Fechas */}
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Fechas</span>
                                <span>
                                    {checkIn?.toLocaleDateString()} - {checkOut?.toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Huéspedes</span>
                                <span>{guests} huéspedes</span>
                            </div>
                        </div>

                        <Separator />

                        {/* Desglose Precio */}
                        <div className="mt-auto space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="underline">${room.price.toLocaleString()} x {days} noches</span>
                                <span>${(room.price * days).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-lg pt-2 border-t border-border/50">
                                <span>Total (COP)</span>
                                <span>${(room.price * days).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Formulario Cliente */}
                    <div className="p-6 flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">
                                {user ? "Confirmar tus datos" : "Datos del titular"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {user ? "Usaremos la información de tu cuenta actual." : "Lena los datos para asegurar tu reserva."}
                            </p>
                        </div>

                        {user ? (
                            // Vista Logueado
                            <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {user.name?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-blue-600 mt-2">
                                    ¡Estás logueado! Tu reserva se vinculará a esta cuenta.
                                </p>
                            </div>
                        ) : (
                            // Vista Formulario (Invitado)
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground">Nombre completo</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ej: Juan Pérez"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-xs uppercase font-bold text-muted-foreground">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="juan@ejemplo.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone" className="text-xs uppercase font-bold text-muted-foreground">Teléfono / Celular</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+57 300 123 4567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground pt-2">
                                    * Se creará una cuenta automáticamente con tu número de teléfono como contraseña temporal.
                                </p>
                            </div>
                        )}

                        <Button
                            size="lg"
                            className="w-full mt-auto font-semibold text-base py-6"
                            onClick={handleCreateReservation}
                            disabled={isLoading || (!user && (!formData.name || !formData.email || !formData.phone))}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                                </>
                            ) : (
                                "Confirmar y reservar"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
