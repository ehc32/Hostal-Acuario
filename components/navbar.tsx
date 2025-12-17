"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, User, LogOut, UserCircle, LayoutDashboard, User2Icon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Navbar() {
    const { user, logout } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [logoUrl, setLogoUrl] = useState("/logo.png")
    const [siteName, setSiteName] = useState("Hostal Acuario")
    const pathname = usePathname()

    // Fetch logo and site name from configuration
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/config")
                if (res.ok) {
                    const data = await res.json()
                    // Solo actualizar si hay un logoUrl válido
                    if (data.logoUrl && data.logoUrl.trim() !== "") {
                        setLogoUrl(data.logoUrl)
                    }
                    if (data.siteName) {
                        setSiteName(data.siteName)
                    }
                }
            } catch (error) {
                console.error("Error fetching config:", error)
            }
        }
        fetchConfig()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled)
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [scrolled])

    const menuItems = [
        { label: "Inicio", href: "/" },
        { label: "Habitaciones", href: "/habitaciones" },
        { label: "Información", href: "/#informacion" },
    ]

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
                scrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-gray-200/50 py-3"
                    : "bg-white border-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
                        <div className="relative w-10 h-10 overflow-hidden  group-hover:shadow-md transition-shadow">
                            <Image
                                src={logoUrl}
                                alt="Hotel Acuario Logo"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <span className="font-bold text-lg text-gray-900 tracking-tight hidden sm:block">
                            {siteName}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-amber-600 hover:bg-amber-50",
                                        isActive ? "text-amber-600 bg-amber-50/50" : "text-gray-600"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                        <Link
                            href="#contacto"
                            className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-full hover:text-amber-600 hover:bg-amber-50"
                        >
                            Contacto
                        </Link>
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/favoritos">
                                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full">
                                    <Heart className="w-5 h-5" />
                                    <span className="sr-only">Favoritos</span>
                                </Button>
                            </Link>

                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-gray-200 p-0 hover:bg-amber-50 hover:border-amber-200 transition-all">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-amber-100/50 text-amber-700">
                                                {user.name ? (
                                                    <span className="font-semibold text-sm">{user.name[0].toUpperCase()}</span>
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name || 'Usuario'}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-amber-50 hover:text-amber-700">
                                                <UserCircle className="h-4 w-4" />
                                                <span>Mi Perfil</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/favoritos" className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-amber-50 hover:text-amber-700">
                                                <Heart className="h-4 w-4" />
                                                <span>Mis Favoritos</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {user.role === 'ADMIN' && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin" className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-amber-50 hover:text-amber-700">
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    <span>Panel Admin</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout} className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700">
                                            <LogOut className="h-4 w-4" />
                                            <span>Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button asChild size="sm" className="bg-amber-600 text-white hover:bg-amber-700 rounded-full px-5 shadow-sm hover:shadow transition-all">
                                    <Link href="/login" className="flex items-center gap-2">
                                        <User2Icon className="h-4 w-4" />
                                        <span>Entrar</span>
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-gray-700 hover:bg-gray-100 rounded-full">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Abrir menú</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-gray-100">
                                <SheetHeader className="p-6 border-b border-gray-100 bg-gray-50/50">
                                    <SheetTitle className="flex items-center gap-2">
                                        <Image
                                            src={logoUrl}
                                            alt="Hotel Acuario"
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />
                                        <span className="font-bold text-gray-900">{siteName}</span>
                                    </SheetTitle>
                                    <SheetDescription>
                                        Bienvenido a tu mejor experiencia.
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="flex flex-col py-4">
                                    <div className="px-4 mb-4">
                                        {user ? (
                                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-semibold text-lg">
                                                        {user.name ? user.name[0].toUpperCase() : <User />}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-medium text-gray-900 truncate">{user.name || 'Usuario'}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button asChild variant="outline" size="sm" className="w-full text-xs justify-start h-8">
                                                        <Link href="/profile">
                                                            <UserCircle className="w-3 h-3 mr-2" />
                                                            Perfil
                                                        </Link>
                                                    </Button>
                                                    {user.role === 'ADMIN' && (
                                                        <Button asChild variant="outline" size="sm" className="w-full text-xs justify-start h-8">
                                                            <Link href="/admin">
                                                                <LayoutDashboard className="w-3 h-3 mr-2" />
                                                                Admin
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="sm" onClick={logout} className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 justify-start h-8 col-span-2">
                                                        <LogOut className="w-3 h-3 mr-2" />
                                                        Cerrar sesión
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-6 shadow-md shadow-amber-200/50">
                                                <Link href="/login" className="flex items-center justify-center gap-2">
                                                    <User2Icon className="h-5 w-5" />
                                                    <span className="text-base">Iniciar Sesión / Registro</span>
                                                </Link>
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex flex-col px-2">
                                        {menuItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                                    pathname === item.href
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        <Link
                                            href="#contacto"
                                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                        >
                                            Contacto
                                        </Link>
                                        <Link
                                            href="/favoritos"
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                                pathname === "/favoritos"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            Favoritos
                                        </Link>
                                    </div>

                                    <div className="mt-auto px-6 py-6 border-t border-gray-100">
                                        <p className="text-xs text-center text-gray-400">
                                            © {new Date().getFullYear()} {siteName}.
                                            <br />
                                            Todos los derechos reservados.
                                        </p>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
