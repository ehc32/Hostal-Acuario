import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { BedDouble, CalendarDays, Users, DollarSign } from "lucide-react"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
    const roomsCount = await prisma.room.count()
    const usersCount = await prisma.user.count()
    const reservationsCount = await prisma.reservation.count()

    // Cast para evitar errores si el campo 'total' no está generado en los tipos aún
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reservations = await (prisma as any).reservation.findMany({ select: { total: true } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRevenue = reservations.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex gap-2">
                    <Link href="/admin/habitaciones">
                        <Button>Revisar Habitaciones</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">+20.1% del mes pasado</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reservas</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reservationsCount}</div>
                        <p className="text-xs text-muted-foreground">+180.1% del mes pasado</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Habitaciones</CardTitle>
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{roomsCount}</div>
                        <p className="text-xs text-muted-foreground">Inventario activo</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount}</div>
                        <p className="text-xs text-muted-foreground">+19 desde la semana pasada</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
