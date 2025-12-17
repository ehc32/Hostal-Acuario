"use client"

import { RoomForm } from "@/components/admin/room-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RoomFormData {
    title: string
    slug: string
    description: string
    price: number
    images: string[]
    amenities: string[]
    holder?: string
}

export default function NuevaHabitacionPage() {
    const router = useRouter()

    async function handleSubmit(data: RoomFormData) {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch("/api/admin/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                toast.success("Habitación creada exitosamente")
                router.push("/admin/habitaciones")
            } else {
                const error = await res.text()
                console.error("Error API:", error)
                toast.error("Error al crear la habitación")
            }
        } catch (error) {
            console.error("Error conexión:", error)
            toast.error("Error de conexión")
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                    <Link href="/admin/habitaciones">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nueva Habitación</h1>
                    <p className="text-sm text-slate-500">
                        Ingresa los detalles para registrar una nueva habitación en el sistema.
                    </p>
                </div>
            </div>

            <RoomForm onSubmit={handleSubmit} />
        </div>
    )
}
