"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"

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
            return (
                <Badge variant={status === "CANCELLED" ? "destructive" : "default"}>
                    {status}
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
                <Link href={`/admin/reservas/${reservation.id}`}>
                    <Button variant="ghost" size="sm">Ver detalles</Button>
                </Link>
            )
        },
    },
]
