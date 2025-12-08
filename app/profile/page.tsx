'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
    const { user, loading, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
            return
        }

        // Si es ADMIN, redirigir al dashboard
        if (user && user.role === "ADMIN") {
            router.push('/dashboard')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando perfil...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Mi Perfil</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gestiona tu información personal y preferencias
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </div>

                <ProfileTabs />
            </div>
        </div>
    )
}
