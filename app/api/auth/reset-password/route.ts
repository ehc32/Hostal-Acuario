import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { email, code, newPassword } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
        }

        // Validar token y expiración
        if (
            !user.resetToken ||
            user.resetToken !== code ||
            !user.resetTokenExpiry ||
            new Date() > user.resetTokenExpiry
        ) {
            return NextResponse.json({ error: "Código inválido o expirado" }, { status: 400 })
        }

        // Hash nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Actualizar usuario
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

        return NextResponse.json({ message: "Contraseña actualizada correctamente" })

    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json({ error: "Error al restablecer contraseña" }, { status: 500 })
    }
}
