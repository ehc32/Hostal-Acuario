"use client"

import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
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

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(`¡Bienvenido, ${data.user.name || 'Usuario'}!`)

                // Guardar token y usuario en localStorage
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                console.log("Login exitoso. Rol:", data.user.role)

                // Redirigir según el rol del usuario usando el Router de Next.js
                if (data.user.role === "ADMIN") {
                    router.push("/admin")
                } else {
                    router.push("/profile")
                }

                // Nota: No ponemos setIsLoading(false) aquí intencionalmente 
                // para que el loading screen se mantenga durante la transición de página
            } else {
                toast.error(data.error || "Error al iniciar sesión")
                setIsLoading(false)
            }
        } catch (error) {
            console.error("Error de login:", error)
            toast.error("Error de conexión. Intenta nuevamente.")
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {isLoading && <LoadingScreen title="Iniciando sesión" description="Verificando credenciales..." />}
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <h1 className="text-2xl font-bold tracking-tight">
                                Bienvenido de nuevo
                            </h1>
                            <FieldDescription className="text-base">
                                Ingresa tus credenciales para acceder
                            </FieldDescription>
                        </Link>
                    </div>

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
                        <div className="flex items-center justify-between">
                            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Field>

                    <Button
                        variant="default"
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 transition-all duration-200"
                    >
                        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                </FieldGroup>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">¿No tienes una cuenta? </span>
                <Link
                    href="/register"
                    className="font-semibold text-[#3b82f6] hover:text-[#00B852] transition-colors"
                >
                    Regístrate gratis
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
        </div>
    )
}
