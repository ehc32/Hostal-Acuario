"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { UserCheck, UserX, Shield, User as UserIcon } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClientCellAction } from "./cell-action"

export type ClientColumn = {
    id: number
    name: string | null
    email: string
    phone: string | null
    role: string
    status: string
    createdAt: Date
}

// Status options para filtrado
export const statusOptions = [
    { label: "Activo", value: "ACTIVE", icon: UserCheck },
    { label: "Inactivo", value: "DELETED", icon: UserX },
]

// Role options para filtrado
export const roleOptions = [
    { label: "Administrador", value: "ADMIN", icon: Shield },
    { label: "Cliente", value: "USER", icon: UserIcon },
]

export const columns: ColumnDef<ClientColumn>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="# ID" />
        ),
        cell: ({ row }) => (
            <div className="font-mono text-xs text-muted-foreground">
                #{row.getValue("id")}
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => {
            const name = row.getValue("name") as string | null
            const email = row.original.email
            const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : email.slice(0, 2).toUpperCase()

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{name || "Sin nombre"}</span>
                        <span className="text-xs text-muted-foreground">{email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Teléfono" />
        ),
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string | null
            return (
                <span className="text-sm text-slate-600">
                    {phone || "—"}
                </span>
            )
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rol" />
        ),
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge
                    variant="outline"
                    className={role === "ADMIN"
                        ? "bg-slate-50 text-slate-600 border-slate-200"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }
                >
                    {role === "ADMIN" ? "Administrador" : "Cliente"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const isActive = status !== "DELETED"

            return (
                <Badge
                    variant="outline"
                    className={isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }
                >
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Registro" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <span className="text-sm text-slate-500">
                    {date.toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ClientCellAction client={row.original} />,
    },
]
