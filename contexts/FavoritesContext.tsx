"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'

interface FavoritesContextType {
    favorites: number[]
    toggleFavorite: (roomId: number) => Promise<void>
    isFavorite: (roomId: number) => boolean
    loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    // Cargar favoritos iniciales al loguearse
    useEffect(() => {
        if (user) {
            fetch('/api/favorites')
                .then(res => res.json())
                .then(data => {
                    if (data.favorites) {
                        setFavorites(data.favorites)
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false))
        } else {
            setFavorites([])
            setLoading(false)
        }
    }, [user])

    const toggleFavorite = async (roomId: number) => {
        if (!user) {
            toast.error("Debes iniciar sesión para guardar favoritos")
            return
        }

        // Optimistic update
        const isFav = favorites.includes(roomId)
        const newFavorites = isFav
            ? favorites.filter(id => id !== roomId)
            : [...favorites, roomId]

        setFavorites(newFavorites)

        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId })
            })

            if (!res.ok) throw new Error("Error al actualizar favorito")

            const data = await res.json()
            if (data.action === 'added') {
                toast.success("Añadido a favoritos")
            } else {
                toast.success("Eliminado de favoritos")
            }
        } catch (error) {
            // Revertir si falla
            setFavorites(favorites)
            toast.error("No se pudo actualizar favoritos")
        }
    }

    const isFavorite = (roomId: number) => favorites.includes(roomId)

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }
    return context
}
