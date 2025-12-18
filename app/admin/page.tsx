import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { BedDouble, CalendarDays, Users, DollarSign, ArrowUpRight, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardDataTable } from "@/components/admin/dashboard-data-table"
import { columns } from "@/components/admin/dashboard-columns"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
    const roomsCount = await prisma.room.count()
    const usersCount = await prisma.user.count()
    const reservationsCount = await prisma.reservation.count()

    // Reservas pendientes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pendingReservations = await (prisma as any).reservation.count({
        where: { status: 'PENDING' }
    })

    // Cast para evitar errores si el campo 'total' no está generado en los tipos aún
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reservations = await (prisma as any).reservation.findMany({ select: { total: true } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRevenue = reservations.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0)

    // Últimas 5 reservas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentReservations = await (prisma as any).reservation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            room: { select: { title: true } },
            user: { select: { name: true, email: true } }
        }
    })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Resumen general del hotel</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/reservas">
                        <Button variant="outline">Ver Reservas</Button>
                    </Link>
                    <Link href="/admin/habitaciones/nueva">
                        <Button>+ Nueva Habitación</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-900">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalRevenue)}
                        </div>
                        <p className="text-xs text-emerald-600 mt-1">Acumulado total</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900">Reservas</CardTitle>
                        <CalendarDays className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-900">{reservationsCount}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-700 border-amber-300">
                                <Clock className="w-3 h-3 mr-1" />
                                {pendingReservations} pendientes
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Habitaciones</CardTitle>
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{roomsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Activas en el sistema</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Registrados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/admin/reservas" className="bg-white p-4 rounded-lg border hover:bg-slate-50 transition-all group block shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 text-base">Reservas</span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-sm text-slate-500">Gestionar todas las solicitudes.</p>
                </Link>

                <Link href="/admin/habitaciones" className="bg-white p-4 rounded-lg border hover:bg-slate-50 transition-all group block shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 text-base">Habitaciones</span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-sm text-slate-500">Editar inventario y precios.</p>
                </Link>

                <Link href="/admin/clientes" className="bg-white p-4 rounded-lg border hover:bg-slate-50 transition-all group block shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 text-base">Clientes</span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-sm text-slate-500">Base de datos de usuarios.</p>
                </Link>
            </div>

            {/* Recent Reservations */}
            <Card className="border-slate-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Reservas Recientes</CardTitle>
                        <CardDescription>Las últimas 5 reservas registradas</CardDescription>
                    </div>
                    <Link href="/admin/reservas">
                        <Button variant="ghost" size="sm">Ver todas</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {/* @ts-ignore */}
                    <DashboardDataTable columns={columns} data={recentReservations} />
                </CardContent>
            </Card>
        </div>
    )
}
