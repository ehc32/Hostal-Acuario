"use client"

import * as React from "react"
import { RoomForm, RoomFormValues } from "@/components/admin/room-form"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EditarHabitacionPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [initialData, setInitialData] = React.useState<any>(null)
    const [loading, setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        const fetchRoom = async () => {
            if (!id) return
            try {
                const res = await fetch(`/api/admin/rooms/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setInitialData(data)
                } else {
                    toast.error("No se pudo cargar la habitación")
                }
            } catch (error) {
                console.error(error)
                toast.error("Error de conexión al cargar")
            } finally {
                setLoading(false)
            }
        }
        fetchRoom()
    }, [id])

    async function handleSubmit(data: RoomFormValues) {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(`/api/admin/rooms/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                toast.success("Habitación actualizada exitosamente")
                router.push("/admin/habitaciones")
            } else {
                toast.error("Error al actualizar la habitación")
            }
        } catch (_) {
            toast.error("Error de conexión")
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
            </div>
        )
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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Editar Habitación</h1>
                    <p className="text-sm text-slate-500">
                        Modifica los detalles de la habitación {initialData?.title && `"${initialData.title}"`}.
                    </p>
                </div>
            </div>

            {initialData ? (
                <RoomForm initialData={initialData} onSubmit={handleSubmit} />
            ) : (
                <div className="text-center py-10 text-muted-foreground">No se encontró la habitación</div>
            )}
        </div>
    )
}
