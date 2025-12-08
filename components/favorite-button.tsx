"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
    roomId: number
    initialIsFavorite?: boolean
}

export function FavoriteButton({ roomId, initialIsFavorite = false }: FavoriteButtonProps) {
    const { user } = useAuth()
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [loading, setLoading] = useState(false)

    // Sincronizar estado inicial si cambia o al montar si tenemos contexto de favoritos
    // Por simplicidad, asumiremos que si el usuario navega, el estado inicial es correcto o se carga luego.
    // Pero si queremos ser precisos, podríamos verificar contra la lista de favoritos del contexto si existiera.

    // Check inicial simple cliente-lado
    useEffect(() => {
        if (user && !initialIsFavorite) {
            fetch('/api/favorites')
                .then(res => res.json())
                .then(data => {
                    // data.favorites es array de roomIds
                    if (data.favorites && Array.isArray(data.favorites) && data.favorites.includes(roomId)) {
                        setIsFavorite(true)
                    }
                })
                .catch(console.error)
        }
    }, [user, roomId, initialIsFavorite])

    const toggleFavorite = async () => {
        if (!user) {
            toast.error("Debes iniciar sesión para guardar favoritos")
            return
        }

        const previousState = isFavorite
        setIsFavorite(!isFavorite) // Optimistic update
        setLoading(true)

        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId })
            })

            if (!res.ok) throw new Error("Error al actualizar favorito")

            const data = await res.json()

            // La API devuelve { added: boolean }
            if (data.added) {
                toast.success("Añadido a favoritos")
                setIsFavorite(true)
            } else {
                toast.info("Eliminado de favoritos")
                setIsFavorite(false)
            }

        } catch (error) {
            setIsFavorite(previousState) // Rollback
            toast.error("No se pudo actualizar favoritos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            disabled={loading}
            className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-full h-10 w-10"
        >
            <Heart
                className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-500"
                )}
            />
        </Button>
    )
}
