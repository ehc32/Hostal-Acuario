import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthFromRequest } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                phone: true,      // Aseguramos traer teléfono
                createdAt: true,
                _count: {         // Traemos conteos útiles
                    select: { reservations: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { id, name, role, status } = body

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        // Construir objeto data dinámicamente para permitir actualizaciones parciales
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {}
        if (name !== undefined) data.name = name
        if (role !== undefined) data.role = role
        if (status !== undefined) data.status = status

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: data
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Error updating user" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const auth = getAuthFromRequest(req)
        if (!auth || auth.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const permanent = searchParams.get('permanent') === 'true'

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        if (permanent) {
            // Eliminación permanente (hard delete)
            const deletedUser = await prisma.user.delete({
                where: { id: Number(id) }
            })
            return NextResponse.json({
                message: "User permanently deleted",
                user: deletedUser
            })
        } else {
            // Soft delete (solo cambiar estado)
            const deletedUser = await prisma.user.update({
                where: { id: Number(id) },
                data: { status: 'DELETED' }
            })
            return NextResponse.json(deletedUser)
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ error: "Error deleting user" }, { status: 500 })
    }
}
