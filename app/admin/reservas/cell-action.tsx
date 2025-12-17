"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

import { ReservationColumn } from "./columns" // Importar solo el tipo si es necesario circular, o definir prop

interface ReservationCellActionProps {
    reservation: ReservationColumn
}

export function ReservationCellAction({ reservation }: ReservationCellActionProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onDelete = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            const res = await fetch(`/api/admin/reservas/${reservation.id}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            })

            if (!res.ok) throw new Error("Error al eliminar")

            toast.success("Reserva eliminada correctamente")
            router.refresh()
        } catch (error) {
            toast.error("No se pudo eliminar la reserva")
            console.error(error)
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la reserva #{reservation.id} y removerá los datos de nuestros servidores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction disabled={loading} onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                            {loading ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/reservas/${reservation.id}`} className="flex items-center gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" />
                            Ver detalles
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
