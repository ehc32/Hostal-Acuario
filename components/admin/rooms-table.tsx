"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronLeft,
    IconChevronRight,
    IconGripVertical,
    IconPlus,
    IconPencil,
    IconTrash,
    IconLoader
} from "@tabler/icons-react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DeleteDialog } from "@/components/admin/data-table-actions"

const roomSchema = z.object({
    id: z.number(),
    title: z.string(),
    price: z.number(),
    images: z.array(z.string()),
    rating: z.number(),
    slug: z.string(),
})

type Room = z.infer<typeof roomSchema>

function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({ id })
    return (
        <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

function DraggableRow({ row }: { row: Row<Room> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function RoomsTable() {
    const router = useRouter()
    const [data, setData] = React.useState<Room[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [loading, setLoading] = React.useState(true)

    const [deletingRoom, setDeletingRoom] = React.useState<Room | null>(null)

    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const fetchRooms = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/rooms', {
                headers: { 'Authorization': `Bearer ${token} ` }
            })
            if (res.ok) {
                const rooms = await res.json()
                setData(rooms)
            }
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    React.useEffect(() => {
        fetchRooms()
    }, [])

    const reloadData = () => fetchRooms()

    async function onConfirmDelete() {
        if (!deletingRoom) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/ api / admin / rooms / ${deletingRoom.id} `, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token} ` }
            })
            if (res.ok) {
                toast.success("Habitación eliminada correctamente")
                setDeletingRoom(null)
                reloadData()
            } else {
                toast.error("Error al eliminar habitación")
            }
        } catch (e) { toast.error("Error de conexión al eliminar") }
    }


    const columns: ColumnDef<Room>[] = React.useMemo(() => [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id} />,
        },
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
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
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground p-1 text-center">Sin foto</div>
                        )}
                    </div>
                )
            }
        },
        {
            accessorKey: "title",
            header: "Título",
            cell: ({ row }) => <div className="font-medium">{row.original.title}</div>
        },
        {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => <Badge variant="outline" className="text-xs font-normal bg-muted">{row.original.slug}</Badge>
        },
        {
            accessorKey: "price",
            header: "Precio",
            cell: ({ row }) => <div>${row.original.price.toLocaleString()} COP</div>
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/ admin / habitaciones / ${row.original.id} `)}>
                        <IconPencil className="size-4 text-muted-foreground hover:text-foreground" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive" onClick={() => setDeletingRoom(row.original)}>
                        <IconTrash className="size-4" />
                        <span className="sr-only">Eliminar</span>
                    </Button>
                </div>
            )
        }
    ], [router])

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data.map(({ id }) => id),
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility, rowSelection, pagination },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = data.findIndex(item => item.id === active.id)
                const newIndex = data.findIndex(item => item.id === over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    if (loading && data.length === 0) {
        return <div className="flex h-32 w-full items-center justify-center"><IconLoader className="animate-spin text-muted-foreground" /></div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Habitaciones</h2>
                <Button asChild>
                    <Link href="/admin/habitaciones/nueva">
                        <IconPlus className="mr-2 size-4" /> Nueva Habitación
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-background">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                    {table.getRowModel().rows.map(row => <DraggableRow key={row.id} row={row} />)}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No se encontraron habitaciones.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                </div>
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <IconChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <IconChevronRight className="size-4" />
                </Button>
            </div>

            <DeleteDialog
                open={!!deletingRoom}
                onOpenChange={(open) => !open && setDeletingRoom(null)}
                onConfirm={onConfirmDelete}
                title="¿Eliminar habitación?"
                description={`¿Estás seguro de que deseas eliminar permanentemente "${deletingRoom?.title}" ? Esta acción no se puede deshacer.`}
            />
        </div>
    )
}
