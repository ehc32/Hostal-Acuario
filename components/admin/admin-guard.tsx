"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingScreen } from "@/components/loading-screen"

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false)
    const [checking, setChecking] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token")
            const userStr = localStorage.getItem("user")

            if (!token || !userStr) {
                router.replace("/login") // Mejor mandar a login
                return
            }

            try {
                const user = JSON.parse(userStr)
                if (user.role !== "ADMIN") {
                    router.replace("/profile") // Si es user normal, a su perfil
                    return
                }
                setAuthorized(true)
            } catch (error) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                router.replace("/login")
            } finally {
                setChecking(false)
            }
        }

        checkAuth()
    }, [router])

    if (checking) {
        return <LoadingScreen fullscreen title="Verificando acceso" description="Comprobando permisos de administrador..." />
    }

    if (!authorized) {
        return null // Ya redirigió
    }

    return <>{children}</>
}
