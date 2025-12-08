"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Users,
    BedDouble,
    CalendarDays,
    LayoutDashboard
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// Sample data
const data = {
    user: {
        name: "Administrador",
        email: "admin@hotel.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Hotel Acuarios",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Plataforma",
            url: "/admin",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Dashboard",
                    url: "/admin",
                },
                {
                    title: "Clientes",
                    url: "/admin/clientes",
                },
                {
                    title: "Reservas",
                    url: "/admin/reservas",
                },
                {
                    title: "Habitaciones",
                    url: "/admin/habitaciones",
                },
            ],
        },
        {
            title: "Configuración",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "/admin/settings",
                },
            ],
        },
    ],
    projects: []
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
