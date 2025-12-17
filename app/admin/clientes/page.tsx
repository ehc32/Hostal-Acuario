import { prisma } from "@/lib/prisma"
import { DataTable } from "./data-table"
import { columns, ClientColumn } from "./columns"

export default async function ClientesPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const formattedClients: ClientColumn[] = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clientes</h1>
                <p className="text-slate-500 mt-1">
                    Gestiona los usuarios registrados en la plataforma.
                </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <DataTable columns={columns} data={formattedClients} />
            </div>
        </div>
    )
}
