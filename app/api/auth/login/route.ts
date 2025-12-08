import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secreto-super-seguro" // Fallback para evitar errores si no está en .env

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email y contraseña son requeridos" },
                { status: 400 }
            )
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            )
        }

        // Verificar status (Soft Delete)
        if (user.status === 'DELETED') {
            return NextResponse.json(
                { error: "Esta cuenta ha sido desactivada. Contacta al administrador." },
                { status: 403 }
            );
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            )
        }

        // Actualizar último login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        })

        // Generar Token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        )

        // Limpiar password antes de enviar
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            token,
            user: userWithoutPassword
        })

    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
