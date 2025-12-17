"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { ReservationCellAction } from "./cell-action"

export type ReservationColumn = {
    id: number
    roomTitle: string
    userName: string
    checkIn: Date
    checkOut: Date
    status: string
    total: number
}

// Status options para filtrado
export const statusOptions = [
    { label: "Pendiente", value: "PENDING", icon: Clock },
    { label: "Confirmada", value: "CONFIRMED", icon: CheckCircle },
    { label: "Completada", value: "COMPLETED", icon: CheckCircle },
    { label: "Cancelada", value: "CANCELLED", icon: XCircle },
]

export const columns: ColumnDef<ReservationColumn>[] = [
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
        accessorKey: "userName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("userName")}</div>
        ),
    },
    {
        accessorKey: "roomTitle",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Habitación" />
        ),
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate">{row.getValue("roomTitle")}</div>
        ),
    },
    {
        accessorKey: "checkIn",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Entrada" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("checkIn"))
            return (
                <div className="text-sm">
                    {date.toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "checkOut",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Salida" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("checkOut"))
            return (
                <div className="text-sm">
                    {date.toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            const statusConfig: Record<string, { label: string; className: string }> = {
                PENDING: {
                    label: "Pendiente",
                    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                },
                CONFIRMED: {
                    label: "Confirmada",
                    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                },
                COMPLETED: {
                    label: "Completada",
                    className: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                },
                CANCELLED: {
                    label: "Cancelada",
                    className: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                }
            }

            const config = statusConfig[status] || {
                label: status,
                className: "bg-slate-50 text-slate-600 border-slate-200"
            }

            return (
                <Badge variant="outline" className={config.className}>
                    {config.label}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "total",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"))
            const formatted = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            }).format(amount)
            return <div className="font-semibold text-slate-900">{formatted}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ReservationCellAction reservation={row.original} />,
    },
]
