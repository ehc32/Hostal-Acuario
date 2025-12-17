"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, parseISO, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
    Loader2,
    Star,
    ArrowLeft,
    CheckCircle2,
    Home,
    Calendar,
    CreditCard,
    User,
    Check
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Room {
    id: number;
    slug?: string;
    title: string;
    description: string;
    price: number;
    priceHour?: number;
    rating: number;
    reviews: number;
    images: string[];
    amenities: string[];
    holder: string;
}

interface CheckoutClientProps {
    room: Room;
    checkIn: string;
    checkOut: string;
    guests: number;
    bookingType: "NIGHTLY" | "HOURLY";
}

export function CheckoutClient({ room, checkIn, checkOut, guests, bookingType }: CheckoutClientProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
    const [reservationId, setReservationId] = React.useState<string>("");

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            setIsAuthenticated(true);
            try {
                const parsed = JSON.parse(savedUser) as {
                    name?: string;
                    email?: string;
                    phone?: string;
                };
                setName(parsed.name ?? "");
                setEmail(parsed.email ?? "");
                setPhone(parsed.phone ?? "");
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const start = checkIn ? parseISO(checkIn) : null;
    const end = checkOut ? parseISO(checkOut) : null;

    const nights = start && end ? Math.max(differenceInDays(end, start), 0) : 0;

    const basePrice = bookingType === "HOURLY" ? (room.priceHour || 0) : room.price;
    const multiplier = bookingType === "HOURLY" ? 1 : nights;

    const total = basePrice * multiplier;
    const serviceFee = Math.round(total * 0.05); // 5% fee
    const finalTotal = total + serviceFee;

    const handleConfirm = async () => {
        if (!isAuthenticated) {
            if (!name || !email || !phone) {
                toast.error("Por favor completa todos tus datos personales");
                return;
            }
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");

            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const payload = {
                userInfo: isAuthenticated ? undefined : { name, email, phone },
                reservationData: {
                    roomId: room.id,
                    checkIn,
                    checkOut,
                    guests,
                    type: bookingType,
                },
            };

            const res = await fetch("/api/reservations/create", {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409) {
                    toast.error("Este usuario ya existe. Por favor inicia sesión.");
                } else {
                    toast.error(data.error || "Error al reservar");
                }
                return;
            }

            // Éxito: Mostrar Dialog
            setReservationId(data.id ? data.id.toString() : Math.floor(Math.random() * 100000).toString());
            setShowSuccessDialog(true);

        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessDialog(false);
        router.push("/profile");
    };

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* DIALOGO DE CONFIRMACIÓN */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <DialogTitle>Reserva confirmada correctamente</DialogTitle>
                        </div>
                        <DialogDescription>
                            Se ha registrado tu reserva con el siguiente radicado y datos asociados.
                            Te enviamos un correo con los detalles.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-md border px-3 py-2 bg-muted/50">
                            <span className="font-medium flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                ID Reserva
                            </span>
                            <span className="font-mono text-primary font-bold text-lg">
                                #{reservationId}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="w-3 h-3" /> Cliente
                                </p>
                                <p className="text-sm font-medium truncate" title={name}>
                                    {name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Home className="w-3 h-3" /> Habitación
                                </p>
                                <p className="text-sm font-medium truncate">
                                    {room.title}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Llegada
                                </p>
                                <p className="text-sm">
                                    {start ? format(start, "d MMM yyyy", { locale: es }) : "-"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Tipo
                                </p>
                                <p className="text-sm">
                                    {bookingType === "HOURLY" ? "Por Rato (3h)" : "Por Noche"}
                                </p>
                            </div>
                            <div className="space-y-1 col-span-2 border-t pt-2 mt-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">Total Pagado</p>
                                    <p className="text-base font-bold text-green-700">
                                        ${finalTotal.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="pt-2 text-xs text-muted-foreground text-center">
                            Puedes gestionar tu reserva desde tu perfil en cualquier momento.
                        </p>
                    </div>

                    <DialogFooter className="mt-4 sm:justify-center gap-2">
                        <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                            Inicio
                        </Button>
                        <Button onClick={handleCloseSuccess} className="w-full bg-green-600 hover:bg-green-700 text-white">
                            Ir a Mis Reservas
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <header className="border-b bg-card sticky top-0 z-50">
                <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg hover:bg-muted">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-sm font-semibold text-foreground">Confirmar reserva</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
                    {/* LEFT COLUMN - BOOKING FORM */}
                    <div className="space-y-8">
                        <section className="bg-card rounded-xl border p-6">
                            <h2 className="text-xl font-semibold mb-6">Detalles del viaje</h2>

                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium mb-1">Fechas</p>
                                        <p className="text-base font-medium">
                                            {bookingType === "HOURLY" ? (
                                                start && format(start, "d 'de' MMMM", { locale: es })
                                            ) : (
                                                <>
                                                    {start && format(start, "d 'de' MMMM", { locale: es })} -{" "}
                                                    {end && format(end, "d", { locale: es })}
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {bookingType === "HOURLY" ? "Por rato (3h)" : `${nights} noches`}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="text-accent hover:bg-muted text-sm font-medium"
                                        onClick={() => router.back()}
                                    >
                                        Editar
                                    </Button>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium mb-1">Huéspedes</p>
                                        <p className="text-base font-medium">
                                            {guests} huésped{guests > 1 ? "es" : ""}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="text-accent hover:bg-muted text-sm font-medium"
                                        onClick={() => router.back()}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            </div>
                        </section>

                        <section className="bg-card rounded-xl border p-6">
                            <h2 className="text-xl font-semibold mb-6">Datos de la reserva</h2>

                            {isAuthenticated ? (
                                <div className="bg-secondary/50 p-5 rounded-lg border border-accent/20 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Check className="w-4 h-4 text-accent" />
                                            <p className="text-sm text-muted-foreground">Sesión iniciada</p>
                                        </div>
                                        <p className="font-semibold text-foreground">{name}</p>
                                        <p className="text-sm text-muted-foreground">{email}</p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("user");
                                            setIsAuthenticated(false);
                                            setName("");
                                            setEmail("");
                                            setPhone("");
                                        }}
                                    >
                                        Cambiar
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-semibold">Nombre completo</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Tu nombre completo"
                                            className="h-11 bg-background border-input"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-semibold">Correo electrónico</Label>
                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="h-11 bg-background border-input"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-semibold">Teléfono / WhatsApp</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-muted-foreground font-medium text-sm">+57</span>
                                            <Input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                type="tel"
                                                placeholder="300 123 4567"
                                                className="pl-12 h-11 bg-background border-input"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Se creará automáticamente una cuenta segura. Tu contraseña será este número.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>

                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            size="lg"
                            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Confirmar Reserva"}
                        </Button>
                    </div>

                    <div className="hidden lg:block">
                        <div className="sticky top-24 bg-card rounded-xl border p-6 space-y-6 shadow-sm">
                            {/* Room Card */}
                            <div className="flex gap-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <Image src={room.images[0] || "/placeholder.svg"} alt={room.title} fill className="object-cover" />
                                </div>

                                <div className="flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                        Alojamiento
                                    </p>
                                    <h3 className="font-semibold text-sm line-clamp-2 text-foreground">{room.title}</h3>

                                    <div className="flex items-center gap-1 mt-2 text-xs">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <span className="text-muted-foreground">(5.0)</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Price Details */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">Desglose del precio</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>
                                            {bookingType === "HOURLY"
                                                ? `$${room.priceHour?.toLocaleString()} × 3 horas`
                                                : `$${room.price.toLocaleString()} × ${nights} noches`}
                                        </span>
                                        <span className="font-medium text-foreground">${total.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tarifa de servicio</span>
                                        <span className="font-medium text-foreground">${serviceFee.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Total */}
                            <div className="bg-secondary/50 rounded-lg p-4 flex justify-between items-center border border-secondary">
                                <span className="font-semibold text-foreground">Total (COP)</span>
                                <span className="text-xl font-bold text-primary">${finalTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
