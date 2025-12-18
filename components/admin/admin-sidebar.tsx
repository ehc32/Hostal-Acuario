"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Users,
    CalendarDays,
    BedDouble,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    HomeIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: Home,
    },
    {
        title: "Reservas",
        href: "/admin/reservas",
        icon: CalendarDays,
    },
    {
        title: "Habitaciones",
        href: "/admin/habitaciones",
        icon: BedDouble,
    },
    {
        title: "Clientes",
        href: "/admin/clientes",
        icon: Users,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = React.useState(false)

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shrink-0",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className={cn(
                "h-16 flex items-center border-b border-slate-100 px-4",
                collapsed ? "justify-center" : "justify-between"
            )}>
                {!collapsed && (
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-white text-sm">
                            HA
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">Hotel Acuario</span>
                    </Link>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-white text-sm">
                        HA
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                                collapsed && "justify-center"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 shrink-0",
                                isActive ? "text-amber-600" : "text-slate-400"
                            )} />
                            {!collapsed && <span>{item.title}</span>}
                        </Link>
                    )
                })}
            </nav>

            <Separator className="bg-slate-100" />

            {/* Footer */}
            <div className="p-2 space-y-1">
                <Link
                    href="/admin/configuracion"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <Settings className="w-5 h-5 shrink-0 text-slate-400" />
                    {!collapsed && <span>Configuración</span>}
                </Link>
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <HomeIcon className="w-5 h-5 shrink-0 text-slate-400" />
                    {!collapsed && <span>Salir al sitio</span>}
                </Link>

                <button
                    onClick={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("user")
                        window.location.href = "/"
                    }}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0 text-red-500" />
                    {!collapsed && <span>Cerrar Sesión</span>}
                </button>

                {/* Collapse Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span>Colapsar</span>
                        </>
                    )}
                </Button>
            </div>
        </aside>
    )
}
