"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Menu, User, LogOut, UserCircle, User2Icon, Database, LayoutDashboard } from "lucide-react"
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
import { ContactModal } from "@/components/contact-modal"

export function Navbar() {
    const { user, logout } = useAuth()
    const [showContact, setShowContact] = useState(false)

    const menuItems = [
        { label: "Inicio", href: "/" },
        { label: "Habitaciones", href: "/habitaciones" },
        { label: "Información", href: "/#informacion" },
        { label: "Contacto", action: () => setShowContact(true) },
    ]

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Hotel Acuario Logo"
                            width={38}
                            height={38}
                            className="object-contain"
                        />
                        <span className="font-semibold text-base text-gray-900">
                            Hotel Acuario
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => (
                            item.action ? (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="relative text-gray-800 font-medium py-1 group text-sm hover:text-amber-600 transition-colors"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-300 group-hover:w-full" />
                                </button>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    className="relative text-gray-800 font-medium py-1 group text-sm"
                                >
                                    {item.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-300 group-hover:w-full" />
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">

                        {/* Favoritos */}
                        <Link
                            href="/favoritos"
                            className="flex items-center gap-1 text-gray-700 hover:text-amber-600 transition-colors text-sm"
                        >
                            <Heart className="w-4 h-4" />
                            <span className="hidden md:inline font-medium">Favoritos</span>
                        </Link>

                        {/* Auth Section */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-transparent px-2">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            {user.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                                        </div>
                                        <span className="hidden md:inline">Mi Cuenta</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name || 'Usuario'}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer w-full flex items-center">
                                            <UserCircle className="mr-2 h-4 w-4" /> Mi Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    {user.role === 'ADMIN' && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer w-full flex items-center">
                                                <span className="mr-2">
                                                    <LayoutDashboard />
                                                </span> Panel Admin
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 w-full flex items-center">
                                        <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild className="text-sm font-medium text-gray-700 hover:text-amber-600">
                                    <Link href="/login" className="flex items-center gap-2">
                                        <User2Icon className="h-4 w-4" />
                                        Iniciar Sesión
                                    </Link>
                                </Button>

                            </div>
                        )}

                        {/* Mobile Menu Button - Podría implementarse un sheet lateral si se desea */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
        </>
    )
}
