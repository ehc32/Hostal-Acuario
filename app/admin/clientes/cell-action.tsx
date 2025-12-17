"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Trash2, UserX, UserCheck, Mail, Phone, Calendar, Shield, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { ClientColumn } from "./columns"

interface ClientCellActionProps {
    client: ClientColumn
}

export function ClientCellAction({ client }: ClientCellActionProps) {
    const [openAlert, setOpenAlert] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Check if client is already deleted/inactive
    const isDeleted = client.status === 'DELETED'

    const onToggleStatus = async () => {
        try {
            setLoading(true)

            const method = isDeleted ? 'PUT' : 'DELETE'
            let url = '/api/admin/users'
            let options: RequestInit = {}

            if (isDeleted) {
                // Reactivar via PUT
                options = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: client.id,
                        status: 'ACTIVE'
                    })
                }
            } else {
                // Desactivar via DELETE (query param)
                url = `/api/admin/users?id=${client.id}`
                options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                }
            }

            const token = localStorage.getItem("token")
            if (token) {
                options.headers = { ...options.headers, Authorization: `Bearer ${token}` }
            }

            const res = await fetch(url, options)

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error || "Error al actualizar estado")
            }

            toast.success(isDeleted ? "Cliente reactivado correctamente" : "Cliente desactivado correctamente")
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "No se pudo realizar la acción")
            console.error(error)
        } finally {
            setLoading(false)
            setOpenAlert(false)
        }
    }

    const initials = client.name
        ? client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : client.email.slice(0, 2).toUpperCase()

    return (
        <>
            {/* Modal de Detalles */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white gap-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-semibold">Ficha de Cliente</DialogTitle>
                        <DialogDescription>
                            Detalles y contacto directo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 py-4 space-y-6">
                        {/* Avatar y Estado */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-slate-100">
                                <AvatarFallback className="bg-slate-50 text-slate-900 text-xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 leading-none">{client.name || "Sin nombre"}</h3>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="font-normal text-slate-500 border-slate-200">
                                        {client.role}
                                    </Badge>
                                    <Badge
                                        variant="default"
                                        className={!isDeleted ? "bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100/50 border-0" : "bg-red-100 text-red-700 hover:bg-red-100 border-0"}
                                    >
                                        {client.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div className="space-y-3">
                            <div className="bg-slate-50/50 p-3 rounded-lg flex items-center gap-3 border border-slate-100">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email</p>
                                    <p className="text-sm text-slate-700 truncate font-medium">{client.email}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 p-3 rounded-lg flex items-center gap-3 border border-slate-100">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Teléfono</p>
                                    <p className="text-sm text-slate-700 font-medium">{client.phone || "No registrado"}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-400 px-1 pt-1">
                                <span>ID: #{client.id}</span>
                                <span>Registrado: {new Date(client.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer con Acción */}
                    <div className="p-6 bg-slate-50/30 border-t flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setOpenDetail(false)}>
                            Cerrar
                        </Button>

                    </div>
                </DialogContent>
            </Dialog>

            {/* Alerta de Borrado/Activación */}
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isDeleted ? "¿Reactivar cliente?" : "¿Desactivar cliente?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isDeleted
                                ? "El cliente volverá a tener acceso a la plataforma."
                                : "El cliente perderá acceso a su cuenta, pero sus datos se conservarán."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={loading}
                            onClick={onToggleStatus}
                            className={isDeleted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            {loading ? "Procesando..." : (isDeleted ? "Reactivar" : "Desactivar")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Menú de Acciones */}
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
                    <DropdownMenuItem onClick={() => setOpenDetail(true)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setOpenAlert(true)}
                        className={isDeleted ? "text-emerald-600 focus:text-emerald-600 cursor-pointer" : "text-red-600 focus:text-red-600 cursor-pointer"}
                    >
                        {isDeleted ? (
                            <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Reactivar
                            </>
                        ) : (
                            <>
                                <UserX className="mr-2 h-4 w-4" />
                                Desactivar
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
