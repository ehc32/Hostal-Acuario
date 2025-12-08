"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Trash2 } from "lucide-react"
import Link from "next/link"
import { DeleteReservationButton } from "@/components/admin/delete-reservation-button"

export type ReservationColumn = {
    id: number
    roomTitle: string
    userName: string
    checkIn: Date
    checkOut: Date
    status: string
    total: number
}

export const columns: ColumnDef<ReservationColumn>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "userName",
        header: "Cliente",
    },
    {
        accessorKey: "roomTitle",
        header: "Habitación",
    },
    {
        accessorKey: "checkIn",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Check-in
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return new Date(row.getValue("checkIn")).toLocaleDateString()
        },
    },
    {
        accessorKey: "checkOut",
        header: "Check-out",
        cell: ({ row }) => {
            return new Date(row.getValue("checkOut")).toLocaleDateString()
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            const statusConfig = {
                PENDING: { label: "Pendiente", variant: "outline" as const, className: "text-yellow-600 border-yellow-200 bg-yellow-50" },
                CONFIRMED: { label: "Confirmada", variant: "default" as const, className: "bg-green-100 text-green-700 border-green-200" },
                COMPLETED: { label: "Completada", variant: "secondary" as const, className: "bg-slate-100 text-slate-700" },
                CANCELLED: { label: "Cancelada", variant: "destructive" as const, className: "bg-red-100 text-red-700 border-red-200" }
            }

            const config = statusConfig[status as keyof typeof statusConfig] || {
                label: status,
                variant: "outline" as const,
                className: "text-slate-600 border-slate-200 bg-slate-50"
            }

            return (
                <Badge variant={config.variant} className={config.className}>
                    {config.label}
                </Badge>
            )
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"))
            const formatted = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const reservation = row.original
            return (
                <div className="flex items-center gap-2">
                    <Link href={`/admin/reservas/${reservation.id}`}>
                        <Button variant="ghost" size="sm">Ver detalles</Button>
                    </Link>
                    <DeleteReservationButton id={reservation.id} />
                </div>
            )
        },
    },
]
