"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Definición de tipo para las reservas mostradas en el dashboard
export type RecentReservation = {
    id: number
    total: number
    status: string
    createdAt: Date
    user: {
        name: string | null
        email: string | null
    } | null
    room: {
        title: string
    } | null
}

export const columns: ColumnDef<RecentReservation>[] = [
    {
        accessorKey: "user",
        header: "Cliente",
        cell: ({ row }) => {
            const user = row.original.user
            return (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-slate-900">{user?.name || "Anónimo"}</span>
                        <span className="text-xs text-slate-500">{user?.email}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "room.title",
        header: "Habitación",
        cell: ({ row }) => (
            <span className="text-sm text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {row.original.room?.title || "—"}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge
                    variant="outline"
                    className={
                        status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                    }
                >
                    {status === 'PENDING' ? 'Pendiente' :
                        status === 'CONFIRMED' ? 'Confirmada' :
                            status === 'CANCELLED' ? 'Cancelada' : status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => {
            return (
                <span className="text-sm text-slate-500">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            )
        }
    },
    {
        accessorKey: "total",
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium text-slate-900">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(row.original.total || 0)}
                </div>
            )
        }
    },
]
