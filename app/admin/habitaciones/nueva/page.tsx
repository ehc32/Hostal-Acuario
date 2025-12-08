"use client"

import { RoomForm } from "@/components/admin/room-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RoomFormData {
    title: string
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
        <div className="w-full space-y-6 py-4 px-4 md:px-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/habitaciones">
                        <IconArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Nueva Habitación</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <RoomForm onSubmit={handleSubmit} />
            </div>
        </div>
    )
}
