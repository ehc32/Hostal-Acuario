"use client";

import * as React from "react";
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
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    IconChevronLeft,
    IconChevronRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconGripVertical,
    IconLoader,
    IconPlus,
} from "@tabler/icons-react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type Row,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { DeleteDialog, EditDialog } from "@/components/admin/data-table-actions";
import { ClientForm } from "@/components/admin/client-form";

// ----------------------
// TYPES LIMPIOS
// ----------------------
export type User = {
    id: number;
    name: string | null;
    email: string;
    role: string;
    status: string;
};

// ----------------------
// DRAG HANDLE
// ----------------------
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({ id });
    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

// ----------------------
// TABLE CELL VIEWER
// ----------------------
function TableCellViewer({ item }: { item: User }) {
    const isMobile = useIsMobile();

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ];

    const chartConfig: ChartConfig = {
        desktop: { label: "Desktop", color: "var(--primary)" },
        mobile: { label: "Mobile", color: "var(--primary)" },
    };

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="text-foreground w-fit px-0 text-left font-medium"
                >
                    {item.name ?? "Sin Nombre"}
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{item.name}</DrawerTitle>
                    <DrawerDescription>Detalles del cliente e historial</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm pb-10">
                    {!isMobile && (
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.6} stroke="var(--color-mobile)" stackId="a" />
                                <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
                            </AreaChart>
                        </ChartContainer>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Email</Label>
                            <Input value={item.email} readOnly className="col-span-3" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Rol</Label>
                            <Input value={item.role} readOnly className="col-span-3" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Estado</Label>
                            <Input value={item.status} readOnly className="col-span-3" />
                        </div>
                    </div>
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

// ----------------------
// DRAGGABLE ROW
// ----------------------
function DraggableRow({ row }: { row: Row<User> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            ref={setNodeRef}
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}

// ----------------------
// MAIN COMPONENT
// ----------------------
export function ClientsTable() {
    const [data, setData] = React.useState<User[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

    const [editingUser, setEditingUser] = React.useState<User | null>(null);
    const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    // ----------------------
    // FETCH USERS
    // ----------------------
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const users: User[] = await res.json();
                setData(users);
            }
        } catch {
            console.error("Error al cargar usuarios");
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const reloadData = () => fetchUsers();

    // ----------------------
    // SAVE EDIT
    // ----------------------
    async function onSaveEdit(updatedData: Partial<User>) {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (res.ok) {
                toast.success("Cliente actualizado correctamente");
                setEditingUser(null);
                reloadData();
            } else {
                toast.error("Error al actualizar cliente");
            }
        } catch {
            toast.error("Error de conexión al actualizar");
        }
    }

    // ----------------------
    // DELETE USER
    // ----------------------
    async function onConfirmDelete() {
        if (!deletingUser) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/admin/users?id=${deletingUser.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                toast.success("Cliente desactivado/eliminado");
                setDeletingUser(null);
                reloadData();
            } else {
                toast.error("Error al eliminar cliente");
            }
        } catch {
            toast.error("Error de conexión al eliminar");
        }
    }

    // ----------------------
    // TABLE COLUMNS
    // ----------------------
    const columns: ColumnDef<User>[] = React.useMemo(
        () => [
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
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && "indeterminate")
                            }
                            onCheckedChange={(value) =>
                                table.toggleAllPageRowsSelected(!!value)
                            }
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                                row.toggleSelected(!!value)
                            }
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "name",
                header: "Nombre",
                cell: ({ row }) => {
                    const item: User = {
                        ...row.original,
                        name: row.original.name ?? "Sin Nombre",
                    };
                    return <TableCellViewer item={item} />;
                },
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => <div>{row.getValue("email")}</div>,
            },
            {
                accessorKey: "role",
                header: "Rol",
                cell: ({ row }) => (
                    <Badge variant="secondary">{row.getValue("role")}</Badge>
                ),
            },
            {
                accessorKey: "status",
                header: "Estado",
                cell: ({ row }) => {
                    const status = row.getValue("status") as string;

                    return (
                        <Badge
                            variant="outline"
                            className={
                                status === "DELETED"
                                    ? "text-red-500 border-red-200"
                                    : "text-green-600 border-green-200"
                            }
                        >
                            {status === "DELETED" ? (
                                <IconLoader className="mr-1 size-3" />
                            ) : (
                                <IconCircleCheckFilled className="mr-1 size-3" />
                            )}
                            {status === "DELETED" ? "Inactivo" : "Activo"}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <IconDotsVertical />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingUser(row.original)}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => setDeletingUser(row.original)}
                            >
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        []
    );

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data.map(({ id }) => id),
        [data]
    );

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
    });

    // ----------------------
    // DRAG END
    // ----------------------
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setData((prevData) => {
                const oldIndex = prevData.findIndex((item) => item.id === active.id);
                const newIndex = prevData.findIndex((item) => item.id === over.id);
                return arrayMove(prevData, oldIndex, newIndex);
            });
        }
    }

    // ----------------------
    // RENDER
    // ----------------------
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Clientes</h2>
                <Button variant="outline" size="sm">
                    <IconPlus className="mr-2 size-4" /> Agregar
                </Button>
            </div>

            <div className="rounded-md border bg-background">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                <SortableContext
                                    items={dataIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table.getRowModel().rows.map((row) => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No hay resultados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <IconChevronLeft className="size-4" />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <IconChevronRight className="size-4" />
                </Button>
            </div>

            <EditDialog
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
                title="Editar Cliente"
                description="Modifica los datos del cliente aquí. Guarda los cambios cuando termines."
            >
                {editingUser && (
                    <ClientForm
                        user={editingUser}
                        onSave={onSaveEdit}
                        onCancel={() => setEditingUser(null)}
                    />
                )}
            </EditDialog>

            <DeleteDialog
                open={!!deletingUser}
                onOpenChange={(open) => !open && setDeletingUser(null)}
                onConfirm={onConfirmDelete}
                description={`¿Estás seguro de que deseas desactivar al usuario ${deletingUser?.name}? Esta acción se puede revertir contactando a soporte.`}
            />
        </div>
    );
}
