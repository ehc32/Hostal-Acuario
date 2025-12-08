import { RoomsTable } from "@/components/admin/rooms-table"

export default function HabitacionesPage() {
    return (
        <div className="flex flex-col gap-5 p-4 w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Habitaciones</h1>
                <p className="text-muted-foreground">
                    Administra las habitaciones disponibles, precios y fotos.
                </p>
            </div>
            <RoomsTable />
        </div>
    )
}
