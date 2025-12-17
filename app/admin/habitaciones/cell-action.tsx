"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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

import { RoomColumn } from "./columns"

interface RoomCellActionProps {
    room: RoomColumn
}

export function RoomCellAction({ room }: RoomCellActionProps) {
    const [openAlert, setOpenAlert] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onDelete = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            const res = await fetch(`/api/admin/rooms/${room.id}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || "No se pudo eliminar la habitación")
            }

            toast.success("Habitación eliminada correctamente")
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al eliminar")
        } finally {
            setLoading(false)
            setOpenAlert(false)
        }
    }

    return (
        <>
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la habitación "{room.title}" y sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction disabled={loading} onClick={onDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
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
                        <Link href={`/habitaciones/${room.slug}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver en sitio
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/habitaciones/${room.id}`} className="flex items-center cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpenAlert(true)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
