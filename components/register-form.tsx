"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { LoadingScreen } from "@/components/loading-screen"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, phone }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("¡Cuenta creada exitosamente!")
                // Guardar token y usuario
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                // Redirigir según el rol del usuario
                setTimeout(() => {
                    if (data.user.role === "ADMIN") {
                        window.location.href = "/dashboard"
                    } else {
                        window.location.href = "/profile"
                    }
                }, 1000)
            } else {
                toast.error(data.error || "Error al crear la cuenta")
                setIsLoading(false)
            }
        } catch (error) {
            toast.error("Error de conexión. Intenta nuevamente.")
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {isLoading && <LoadingScreen title="Creando cuenta" description="Configurando tu perfil..." />}
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <h1 className="text-2xl font-bold tracking-tight">
                                Crea tu cuenta
                            </h1>
                            <FieldDescription className="text-base">
                                Completa tus datos para comenzar
                            </FieldDescription>
                        </Link>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Juan Pérez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="phone">Teléfono (opcional)</FieldLabel>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+57 300 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </Field>

                    <Button
                        variant="default"
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 transition-all duration-200"
                    >
                        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                    </Button>
                </FieldGroup>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
                <Link
                    href="/login"
                    className="font-semibold text-[#3b82f6] hover:text-[#00B852] transition-colors"
                >
                    Inicia sesión
                </Link>
            </div>

            <FieldDescription className="px-6 text-center text-xs">
                Al continuar, aceptas nuestros{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                    Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                    Política de Privacidad
                </Link>
                .
            </FieldDescription>

            <div className="text-center text-sm mt-4">
                <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}
