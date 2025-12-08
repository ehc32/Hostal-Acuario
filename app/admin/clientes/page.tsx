import { ClientsTable } from "@/components/admin/clients-table"

export default function ClientsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                <p className="text-muted-foreground">
                    Gestiona los usuarios registrados en la plataforma.
                </p>
            </div>
            <ClientsTable />
        </div>
    )
}
