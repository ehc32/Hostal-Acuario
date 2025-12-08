"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CancelReservationButton({ id, currentStatus }: { id: number, currentStatus: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCancel = async () => {
        if (!confirm("¿Estás seguro de cancelar esta reserva?")) return

        setLoading(true)
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "CANCELLED" })
            })

            if (!res.ok) throw new Error("Error al cancelar")

            toast.success("Reserva cancelada")
            router.refresh()
        } catch (error) {
            toast.error("No se pudo cancelar la reserva")
        } finally {
            setLoading(false)
        }
    }

    if (currentStatus === "CANCELLED") {
        return <Badge variant="destructive">Cancelada</Badge>
    }

    return (
        <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
            className="w-full"
        >
            {loading ? "Cancelando..." : "Cancelar Reserva"}
        </Button>
    )
}
