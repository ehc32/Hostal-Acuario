"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
            router.push("/login")
            return
        }

        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Si es CLIENT, redirigir al perfil
        if (parsedUser.role === "CLIENT") {
            router.push("/profile")
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                ¡Bienvenido, {user.name || user.email}!
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Has iniciado sesión correctamente
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => router.push('/profile')}
                                variant="outline"
                                className="rounded-full"
                            >
                                Ver Perfil
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="rounded-full"
                            >
                                Cerrar sesión
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="font-semibold text-lg mb-2">Información de usuario</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                                <p><span className="font-medium">Nombre:</span> {user.name || "No especificado"}</p>
                                <p><span className="font-medium">Teléfono:</span> {user.phone || "No especificado"}</p>
                                <p><span className="font-medium">Rol:</span> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{user.role}</span></p>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-xl p-6">
                            <h3 className="font-semibold text-lg mb-2">Estado de la cuenta</h3>
                            <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Cuenta activa
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Autenticación exitosa
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Token válido
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-lg mb-2">🎉 Sistema de autenticación funcionando</h3>
                        <p className="text-gray-600 text-sm">
                            El sistema de login y registro está completamente funcional.
                            Puedes probar cerrando sesión y volviendo a iniciar sesión con tus credenciales.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
