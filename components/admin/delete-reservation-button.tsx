"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteReservationButtonProps {
    id: number
}

export function DeleteReservationButton({ id }: DeleteReservationButtonProps) {
    const [showDialog, setShowDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Error al eliminar")
            }

            toast.success("Reserva eliminada exitosamente")
            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
            toast.error(error instanceof Error ? error.message : "No se pudo eliminar la reserva")
        } finally {
            setLoading(false)
            setShowDialog(false)
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation()
                    setShowDialog(true)
                }}
                disabled={loading}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta reserva?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La reserva será eliminada permanentemente de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (e: React.MouseEvent) => {
                                e.preventDefault();
                                e.stopPropagation();
                                await handleDelete();
                            }}
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Sí, eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
