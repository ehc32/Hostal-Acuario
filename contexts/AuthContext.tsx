"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: number
    email: string
    name?: string
    phone?: string
    role: string
    status?: string
    createdAt: string
    updatedAt: string
    lastLogin?: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            try {
                setUser(JSON.parse(userData))
            } catch (error) {
                console.error('Error parsing user data:', error)
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Error al iniciar sesión')
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData }
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
