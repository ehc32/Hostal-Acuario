"use client"

import * as React from "react"
import { RoomForm } from "@/components/admin/room-form"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft, IconLoader } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EditarHabitacionPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [initialData, setInitialData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

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
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        fetchRoom()
    }, [id])

    async function handleSubmit(data: any) {
        try {
            const token = localStorage.getItem('token')
            // Data ya viene procesada con amenities array y nuevas imagenes
            const res = await fetch(`/api/admin/rooms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success("Habitación actualizada exitosamente")
                router.push('/admin/habitaciones')
            } else {
                toast.error("Error al actualizar la habitación")
            }
        } catch (e) {
            toast.error("Error de conexión")
        }
    }

    if (loading) return <div className="flex h-[50vh] w-full items-center justify-center"><IconLoader className="animate-spin text-muted-foreground" /></div>

    return (
        <div className="w-full space-y-6 py-4 px-4 md:px-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/habitaciones"><IconArrowLeft /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Editar Habitación</h1>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                {initialData ? (
                    <RoomForm initialData={initialData} onSubmit={handleSubmit} />
                ) : (
                    <div className="text-center py-10">No se encontró la habitación</div>
                )}
            </div>
        </div>
    )
}
