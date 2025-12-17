import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 shrink-0 border-b bg-white flex items-center justify-between px-6">
                    <h1 className="font-semibold text-slate-900">Panel de Administración</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">Hotel Acuario</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
