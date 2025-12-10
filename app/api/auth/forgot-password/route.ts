import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import crypto from "crypto"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // No revelar que el usuario no existe por seguridad
            return NextResponse.json({ message: "Si el correo existe, se ha enviado un código." })
        }

        // Generar código de 6 dígitos
        const resetToken = crypto.randomInt(100000, 999999).toString()
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora de validez

        // Guardar en DB
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        })

        // Configurar transporte de correo
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // true para 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        // Enviar correo
        await transporter.sendMail({
            from: `"Hostal Acuario" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Recuperación de Contraseña",
            text: `Tu código de recuperación es: ${resetToken}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #d97706;">Hola ${user.name || 'Usuario'}</h2>
                    <p>Has solicitado restablecer tu contraseña. Usa el siguiente código para continuar:</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111;">${resetToken}</span>
                    </div>
                    <p>Este código expira en 1 hora.</p>
                    <p>Si no solicitaste esto, ignora este correo.</p>
                </div>
            `,
        })

        return NextResponse.json({ message: "Correo enviado con éxito" })

    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
    }
}
