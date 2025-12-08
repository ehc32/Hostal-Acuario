import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="w-full">
                <div className="p-4 flex items-center gap-2 border-b">
                    <SidebarTrigger />
                    <span className="font-semibold">Panel de Administración</span>
                </div>
                <div className="p-4 bg-muted/10 min-h-screen">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
