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
    Home,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/* ----------------------------------------------------
   TIPOS CORRECTOS (eliminan todos los ANY)
---------------------------------------------------- */

interface Room {
    id: number;
    slug?: string;
    title: string;
    description: string;
    price: number;
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
}

/* ----------------------------------------------------
   COMPONENTE
---------------------------------------------------- */

export function CheckoutClient({
    room,
    checkIn,
    checkOut,
    guests,
}: CheckoutClientProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");

    /* ----------------------------------------------------
       AUTOCARGAR USUARIO LOGUEADO
    ---------------------------------------------------- */
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

    /* ----------------------------------------------------
       CÁLCULOS
    ---------------------------------------------------- */
    const start = checkIn ? parseISO(checkIn) : null;
    const end = checkOut ? parseISO(checkOut) : null;

    const nights =
        start && end ? Math.max(differenceInDays(end, start), 0) : 0;

    const total = nights * room.price;
    const serviceFee = Math.round(total * 0.05);
    const finalTotal = total + serviceFee;

    /* ----------------------------------------------------
       CONFIRMAR RESERVA (sin ANY)
    ---------------------------------------------------- */
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

            // TIPADO seguro en lugar de ANY
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

            toast.success("¡Reserva confirmada con éxito!");
            router.push("/profile");
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    };

    /* ----------------------------------------------------
       UI
    ---------------------------------------------------- */

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* HEADER */}
            <header className="bg-background border-b h-20 flex items-center sticky top-0 z-50">
                <div className="max-w-7xl w-full mx-auto px-4 md:px-8 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Home className="w-5 h-5" />
                    <h1 className="text-xl font-bold">Regresar</h1>
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 xl:gap-24">
                    {/* IZQUIERDA */}
                    <div className="space-y-10">
                        {/* VIAJE */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Tu viaje</h2>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-semibold">Fechas</p>
                                    <p className="text-muted-foreground">
                                        {start &&
                                            format(start, "d 'de' MMM", {
                                                locale: es,
                                            })}{" "}
                                        -{" "}
                                        {end &&
                                            format(end, "d 'de' MMM", {
                                                locale: es,
                                            })}
                                    </p>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-foreground font-semibold underline"
                                    onClick={() => router.back()}
                                >
                                    Editar
                                </Button>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">Huéspedes</p>
                                    <p className="text-muted-foreground">
                                        {guests} huésped
                                        {guests > 1 ? "es" : ""}
                                    </p>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-foreground font-semibold underline"
                                    onClick={() => router.back()}
                                >
                                    Editar
                                </Button>
                            </div>
                        </section>

                        <Separator />

                        {/* CUENTA */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">
                                Inicia sesión o regístrate
                            </h2>

                            {isAuthenticated ? (
                                <div className="bg-muted p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-sm text-muted-foreground">
                                            Logueado como
                                        </p>
                                        <p className="font-bold text-lg">
                                            {name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {email}
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
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
                                <div className="grid gap-4 max-w-md">
                                    <div className="grid gap-1.5">
                                        <Label>Nombre completo</Label>
                                        <Input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Como aparece en tu documento"
                                            className="h-12 text-base"
                                        />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Correo electrónico</Label>
                                        <Input
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            type="email"
                                            placeholder="Para enviarte el recibo"
                                            className="h-12 text-base"
                                        />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Teléfono / WhatsApp</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3.5 text-muted-foreground font-medium text-base">
                                                +57
                                            </span>
                                            <Input
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                type="tel"
                                                placeholder="300 123 4567"
                                                className="pl-12 h-12 text-base"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Te crearemos una cuenta segura
                                            automáticamente. Tu contraseña será
                                            este número de teléfono.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>

                        <Separator />

                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            size="lg"
                            className="w-full md:w-auto min-w-[200px] h-14 text-lg bg-primary hover:bg-primary/90 font-bold rounded-xl"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                "Confirmar Reserva"
                            )}
                        </Button>
                    </div>

                    {/* DERECHA */}
                    <div className="hidden lg:block">
                        <div className="sticky top-32 border rounded-2xl p-6 shadow-lg bg-card text-card-foreground">
                            <div className="flex gap-4 mb-6">
                                <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-muted">
                                    <Image
                                        src={room.images[0] || "/placeholder.svg"}
                                        alt={room.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex flex-col justify-center">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Lugar
                                    </p>
                                    <h3 className="font-semibold text-base line-clamp-2">
                                        {room.title}
                                    </h3>

                                    <div className="flex items-center gap-1 mt-1 text-sm">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>5.0 (Recomendado)</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <h3 className="font-bold text-lg mb-4">
                                Detalles del precio
                            </h3>

                            <div className="space-y-3 text-base">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        ${room.price.toLocaleString()} x{" "}
                                        {nights} noches
                                    </span>
                                    <span>${total.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground underline">
                                        Tarifa de limpieza
                                    </span>
                                    <span>$0</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground underline">
                                        Tarifa de servicio
                                    </span>
                                    <span>${serviceFee.toLocaleString()}</span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="flex justify-between font-bold text-xl">
                                <span>Total (COP)</span>
                                <span>${finalTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
