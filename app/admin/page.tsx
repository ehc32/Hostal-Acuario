import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { BedDouble, CalendarDays, Users, DollarSign, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/admin/reservas" className="group">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Gestionar Reservas</CardTitle>
                                <CardDescription>Ver, confirmar o cancelar</CardDescription>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/admin/habitaciones" className="group">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Habitaciones</CardTitle>
                                <CardDescription>Editar precios y fotos</CardDescription>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/admin/clientes" className="group">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Clientes</CardTitle>
                                <CardDescription>Ver información de usuarios</CardDescription>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                    </Card>
                </Link>
            </div>

            {/* Recent Reservations */}
            <Card>
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
                    <div className="space-y-4">
                        {recentReservations.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No hay reservas recientes</p>
                        ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            recentReservations.map((res: any) => (
                                <div key={res.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{res.user?.name || res.user?.email || 'Anónimo'}</p>
                                            <p className="text-xs text-muted-foreground">{res.room?.title || 'Habitación'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant="outline"
                                            className={
                                                res.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    res.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        'bg-slate-50 text-slate-600 border-slate-200'
                                            }
                                        >
                                            {res.status === 'PENDING' ? 'Pendiente' :
                                                res.status === 'CONFIRMED' ? 'Confirmada' :
                                                    res.status === 'CANCELLED' ? 'Cancelada' : 'Completada'}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(res.total || 0)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
