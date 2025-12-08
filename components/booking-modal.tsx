"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Image from "next/image"
import { format, parseISO, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, Mail, Phone, User as UserIcon, Calendar, CreditCard } from "lucide-react"

interface BookingModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    room: {
        id: number
        title: string
        price: number
        images: string[]
        holder: string
    }
    checkIn: string
    checkOut: string
    guests: number
}

export function BookingModal({ isOpen, onOpenChange, room, checkIn, checkOut, guests }: BookingModalProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)

    // Form States
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")

    React.useEffect(() => {
        // Verificar sesión simple
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            setIsAuthenticated(true)
            try {
                const parsed = JSON.parse(savedUser)
                setName(parsed.name || "")
                setEmail(parsed.email || "")
                setPhone(parsed.phone || "")
            } catch (e) { console.error(e) }
        } else {
            setIsAuthenticated(false)
            setName("")
            setEmail("")
            setPhone("")
        }
    }, [isOpen])

    const start = checkIn ? parseISO(checkIn) : null
    const end = checkOut ? parseISO(checkOut) : null
    const nights = start && end ? Math.max(differenceInDays(end, start), 0) : 0
    const total = nights * room.price
    const serviceFee = Math.round(total * 0.05) // 5% fake fee
    const finalTotal = total + serviceFee

    const handleConfirm = async () => {
        if (!isAuthenticated) {
            if (!name || !email || !phone) {
                toast.error("Por favor completa todos tus datos personales")
                return
            }
        }

        setIsLoading(true)
        try {
            const token = localStorage.getItem('token')
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (token) headers['Authorization'] = `Bearer ${token}`

            const payload = {
                userInfo: isAuthenticated ? undefined : { name, email, phone },
                reservationData: {
                    roomId: room.id,
                    checkIn,
                    checkOut,
                    guests
                }
            }

            const res = await fetch('/api/reservations/create', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 409) {
                    toast.error("Este correo o teléfono ya está registrado. Por favor inicia sesión.")
                } else {
                    toast.error(data.error || "Error al procesar reserva")
                }
                return
            }

            toast.success("¡Reserva confirmada!", {
                description: `Hemos enviado los detalles a ${email || 'tu correo'}.`
            })
            onOpenChange(false)

        } catch (error) {
            console.error(error)
            toast.error("Error de conexión")
        } finally {
            setIsLoading(false)
        }
    }

    if (!room) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-[90vw] p-0 overflow-hidden gap-0 border-none shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh] overflow-y-auto lg:overflow-visible">

                    {/* COLUMNA IZQUIERDA: FORMULARIO */}
                    <div className="p-6 md:p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Confirmar y pagar</DialogTitle>
                            <DialogDescription>
                                Estás a un paso de tu viaje.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <UserIcon className="w-5 h-5" /> Tu información
                            </h3>

                            {isAuthenticated ? (
                                <div className="bg-muted/50 p-4 rounded-lg space-y-2 border">
                                    <p className="text-sm font-medium">Sesión iniciada como:</p>
                                    <p className="text-lg font-bold">{name}</p>
                                    <p className="text-muted-foreground">{email}</p>
                                    <Button variant="link" className="p-0 h-auto text-primary" onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        setIsAuthenticated(false);
                                        setName(""); setEmail(""); setPhone("");
                                    }}>
                                        Cambiar cuenta
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre completo</Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="name" placeholder="Juan Pérez" className="pl-9" value={name} onChange={e => setName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="email" type="email" placeholder="juan@ejemplo.com" className="pl-9" value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="phone" type="tel" placeholder="+57 300 123 4567" className="pl-9" value={phone} onChange={e => setPhone(e.target.value)} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Te crearemos una cuenta automáticamente. Tu contraseña será este número.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Política de Cancelación
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Cancelación gratuita hasta 48 horas antes de la llegada. Después de eso, cancela antes de las 3:00 PM del día de llegada y obtén un reembolso total menos la primera noche.
                            </p>
                        </div>

                        <Button onClick={handleConfirm} disabled={isLoading} className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Confirmar Reserva"}
                        </Button>
                    </div>

                    {/* COLUMNA DERECHA: RESUMEN */}
                    <div className="bg-muted/30 p-6 md:p-8 flex flex-col border-l">
                        <div className="bg-card rounded-xl border shadow-sm p-4 mb-6 flex gap-4">
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                <Image src={room.images[0] || '/placeholder.svg'} alt={room.title} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Habitación</p>
                                <h4 className="font-semibold line-clamp-2">{room.title}</h4>
                                <p className="text-sm text-muted-foreground">{room.holder}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs font-medium">★ 5.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <h3 className="font-bold text-lg border-b pb-4">Detalles del precio</h3>

                            <div className="flex justify-between items-center text-sm">
                                <span>${room.price.toLocaleString()} x {nights} noches</span>
                                <span>${total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="underline decoration-dotted">Tarifa de limpieza</span>
                                <span>$0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="underline decoration-dotted">Tarifa de servicio</span>
                                <span>${serviceFee.toLocaleString()}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total (COP)</span>
                                <span>${finalTotal.toLocaleString()}</span>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-6">
                                <div className="flex gap-3">
                                    <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-semibold text-amber-700">Tus fechas son claras</p>
                                        <p className="text-amber-800/80">
                                            {start && format(start, "d 'de' MMM", { locale: es })} - {end && format(end, "d 'de' MMM, yyyy", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
