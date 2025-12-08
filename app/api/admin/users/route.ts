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
                createdAt: true
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

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, role, status }
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

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        const deletedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { status: 'DELETED' }
        })

        return NextResponse.json(deletedUser)
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ error: "Error deleting user" }, { status: 500 })
    }
}
