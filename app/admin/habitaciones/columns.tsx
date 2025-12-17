"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2, Wind, Fan, CircleOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoomCellAction } from "./cell-action"

export type RoomColumn = {
    id: number
    title: string
    slug: string
    price: number
    priceHour: number | null
    climate: string | null
    rating: number
    images: string[]
}

// Climate options para filtrado - Actualizados a valores reales de Prisma
export const climateOptions = [
    { label: "Aire Acondicionado", value: "AIRE", icon: Wind },
    { label: "Ventilador", value: "VENTILADOR", icon: Fan },
    { label: "Ninguno", value: "NONE", icon: CircleOff },
]

export const columns: ColumnDef<RoomColumn>[] = [
    {
        id: "image",
        header: "Imagen",
        cell: ({ row }) => {
            const img = row.original.images && row.original.images.length > 0 ? row.original.images[0] : null
            return (
                <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted border">
                    {img ? (
                        <Image src={img} alt={row.original.title} fill className="object-cover" sizes="64px" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            Sin foto
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Título" />
        ),
        cell: ({ row }) => (
            <div className="font-medium max-w-[200px] truncate">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "slug",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="text-xs font-mono bg-slate-50">
                {row.getValue("slug")}
            </Badge>
        ),
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Precio/Noche" />
        ),
        cell: ({ row }) => {
            const price = row.getValue("price") as number
            const formatted = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            }).format(price)
            return <div className="font-semibold text-slate-900">{formatted}</div>
        },
    },
    {
        accessorKey: "priceHour",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Precio/Hora" />
        ),
        cell: ({ row }) => {
            const priceHour = row.getValue("priceHour") as number | null
            if (!priceHour) return <span className="text-muted-foreground">—</span>
            const formatted = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            }).format(priceHour)
            return <div className="text-slate-600">{formatted}</div>
        },
    },
    {
        accessorKey: "climate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Clima" />
        ),
        cell: ({ row }) => {
            const climate = row.getValue("climate") as string | null

            if (climate === "AIRE") {
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Wind className="w-3 h-3 mr-1" />
                        A/C
                    </Badge>
                )
            }

            if (climate === "VENTILADOR") {
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Fan className="w-3 h-3 mr-1" />
                        Ventilador
                    </Badge>
                )
            }

            return (
                <span className="text-muted-foreground text-xs">—</span>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "rating",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rating" />
        ),
        cell: ({ row }) => {
            const rating = row.getValue("rating") as number
            return (
                <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <RoomCellAction room={row.original} />,
    },
]
