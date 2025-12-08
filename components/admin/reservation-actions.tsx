"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"
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

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

interface ReservationActionsProps {
    id: number
    currentStatus: ReservationStatus
}

export function ReservationActions({ id, currentStatus }: ReservationActionsProps) {
    const [loading, setLoading] = useState(false)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const router = useRouter()

    console.log('ReservationActions rendered:', { id, currentStatus, showCancelDialog, showConfirmDialog })

    const updateReservationStatus = async (newStatus: ReservationStatus, successMessage: string) => {
        setLoading(true)
        try {
            console.log('Updating reservation:', { id, newStatus })

            const res = await fetch(`/api/reservations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            })

            const data = await res.json()
            console.log('Response:', { ok: res.ok, status: res.status, data })

            if (!res.ok) {
                throw new Error(data.error || "Error al actualizar")
            }

            toast.success(successMessage)
            router.refresh()
        } catch (error) {
            console.error('Update error:', error)
            toast.error(error instanceof Error ? error.message : "No se pudo actualizar la reserva")
        } finally {
            setLoading(false)
            setShowCancelDialog(false)
            setShowConfirmDialog(false)
        }
    }

    const handleConfirm = async () => {
        console.log('handleConfirm called')
        await updateReservationStatus("CONFIRMED", "Reserva confirmada exitosamente")
    }

    const handleCancel = async () => {
        console.log('handleCancel called')
        await updateReservationStatus("CANCELLED", "Reserva cancelada")
    }

    // Si ya está cancelada, no mostrar acciones
    if (currentStatus === "CANCELLED") {
        return (
            <>
                <div className="flex items-center gap-2 justify-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700 font-medium">Reserva Cancelada</span>
                </div>
                {/* Dialogs siempre disponibles */}
                {renderDialogs()}
            </>
        )
    }

    // Si ya está confirmada
    if (currentStatus === "CONFIRMED") {
        return (
            <>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-green-700 font-medium">Reserva Confirmada</span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            console.log('Cancelar button clicked (CONFIRMED state)')
                            setShowCancelDialog(true)
                        }}
                        disabled={loading}
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        Cancelar Reserva
                    </Button>
                </div>
                {/* Dialogs siempre disponibles */}
                {renderDialogs()}
            </>
        )
    }

    // Función para renderizar los diálogos
    function renderDialogs() {
        return (
            <>
                {/* Dialog de Confirmación */}
                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Confirmar recibido del cliente?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esto marcará la reserva como confirmada y notificará que el cliente ha sido recibido exitosamente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async (e: React.MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await handleConfirm();
                                }}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={loading}
                            >
                                {loading ? 'Confirmando...' : 'Confirmar'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Dialog de Cancelación */}
                <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Cancelar esta reserva?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción marcará la reserva como cancelada. El cliente será notificado de la cancelación.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={loading}>No, mantener</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async (e: React.MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await handleCancel();
                                }}
                                variant="destructive"
                                disabled={loading}
                            >
                                {loading ? 'Cancelando...' : 'Sí, cancelar'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        )
    }

    // Si está pendiente, mostrar ambas opciones
    return (
        <>
            <div className="space-y-3">
                <Button
                    onClick={() => {
                        console.log('Confirmar button clicked - opening dialog')
                        setShowConfirmDialog(true)
                    }}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {loading ? 'Procesando...' : 'Confirmar Recibido'}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        console.log('Cancelar button clicked - opening dialog')
                        setShowCancelDialog(true)
                    }}
                    disabled={loading}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <XCircle className="mr-2 h-5 w-5" />
                    {loading ? 'Procesando...' : 'Cancelar Reserva'}
                </Button>
            </div>
            {/* Dialogs siempre disponibles */}
            {renderDialogs()}
        </>
    )
}
