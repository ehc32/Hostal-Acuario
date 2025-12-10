'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowLeft, GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState<1 | 2>(1)
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Error al enviar código')

            toast.success("Código enviado a tu correo")
            setStep(2)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Error al restablecer contraseña')

            toast.success("Contraseña actualizada correctamente")
            router.push('/login')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6 md:p-10 bg-background">
            <div className="w-full max-w-[400px] flex flex-col gap-6">

                {/* Header Section (Igual que Login) */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <Link href="/" className="flex flex-col items-center gap-2 font-medium">

                        <span className="sr-only">Hotel Acuario</span>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {step === 1 ? 'Recuperar Contraseña' : 'Establecer Nueva Contraseña'}
                    </h1>
                    <p className="text-base text-muted-foreground text-center">
                        {step === 1
                            ? 'Ingresa tu correo para recibir un código de verificación.'
                            : `Hemos enviado un código a ${email}`}
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={step === 1 ? handleSendCode : handleResetPassword}>
                    <div className="flex flex-col gap-6">

                        {step === 1 ? (
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Código de Verificación</Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="123456"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        maxLength={6}
                                        className="text-center tracking-widest text-lg"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </>
                        )}

                        <Button
                            variant="default"
                            size="lg"
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 transition-all duration-200"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {step === 1
                                ? (loading ? "Enviando..." : "Enviar Código")
                                : (loading ? "Restableciendo..." : "Cambiar Contraseña")
                            }
                        </Button>

                        {step === 2 && (
                            <Button
                                type="button"
                                variant="link" // Changed to link variant for cleaner look
                                className="w-full text-muted-foreground hover:text-foreground"
                                onClick={() => setStep(1)}
                            >
                                Cambiar correo
                            </Button>
                        )}

                        <div className="text-center text-sm">
                            <Link href="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                                Volver al inicio de sesión
                            </Link>
                        </div>

                    </div>
                </form>

            </div>
        </div>
    )
}
